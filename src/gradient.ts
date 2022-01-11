import { Color } from ".";
import { Colour, ColourSpace } from "./colour";
import * as mathExt from "./mathExt";

type InterpFtn = (t: number, a: number, b: number) => number;
type CyclicInterpFtn = (t: number, a: number, b: number, cycles?: number) => number;
type ToColFtn = (c1: number, c2: number, c3: number) => Colour;
type FromColFtn = (c: Colour) => number[];

/** the available interpolation methods supported by the library */
export enum Interpolation {
    linear,
    inc_quadratic,
    dec_quadratic,
    cubic,
}

interface CastingFtns {
    fromColour: FromColFtn;
    toColour: ToColFtn;
}

interface InterpFtns {
    interpFtn: InterpFtn;
    cyclicInterpFtn: CyclicInterpFtn;
}

/** any form of 1 dimensional gradient */
export interface Gradient {
    /** get the colour at a specific point along the gradient, range [0, 1] */
    getAt(t: number): Colour
}

export class DirectGradient extends Object implements Gradient {

    public cycles: number;

    // start colour in easy to interpolate form
    private s1: number;
    private s2: number;
    private s3: number;

    // end colour in easy to interpolate form
    private e1: number;
    private e2: number;
    private e3: number;

    private cyclicArg: number;

    private fromColour: FromColFtn;
    private toColour: ToColFtn;

    private interpFtn: InterpFtn;
    private cyclicInterpFtn: CyclicInterpFtn;

    private colourSpace: ColourSpace;
    private interpMethod: Interpolation;

    private _longRoute: boolean;

    /** represents a smooth gradient between two colours */
    constructor (startColour: Colour, endColour: Colour, space = ColourSpace.RGB, interpolation = Interpolation.linear, longRoute = false, cycles = 0) {
        super();

        this.colourSpace = space;
        this.interpMethod = interpolation;

        let { fromColour, toColour } = getCastingFtns(space);
        let { interpFtn, cyclicInterpFtn } = getInterpFtns(interpolation, longRoute);

        this._longRoute = longRoute;

        this.toColour = toColour;
        this.fromColour = fromColour;

        this.interpFtn = interpFtn;
        this.cyclicInterpFtn = cyclicInterpFtn;

        [this.s1, this.s2, this.s3] = fromColour(startColour);
        [this.e1, this.e2, this.e3] = fromColour(endColour);

        this.cyclicArg = getCyclicArg(space);

        this.cycles = cycles;
    }

    public getAt(t: number): Colour {
        return this.toColour(
            0b100 & this.cyclicArg ? this.cyclicInterpFtn(t, this.s1, this.e1, this.cycles) : this.interpFtn(t, this.s1, this.e1),
            0b010 & this.cyclicArg ? this.cyclicInterpFtn(t, this.s2, this.e2, this.cycles) : this.interpFtn(t, this.s2, this.e2),
            0b001 & this.cyclicArg ? this.cyclicInterpFtn(t, this.s3, this.e3, this.cycles) : this.interpFtn(t, this.s3, this.e3)
        );
    }

    public get startColour(): Colour {
        return this.toColour(this.s1, this.s2, this.s3);
    }
    
    public get endColour(): Colour {
        return this.toColour(this.e1, this.e2, this.e3);
    }
    
    public set startColour(c : Colour) {
        [this.s1, this.s2, this.s3] = this.fromColour(c);
    }
    
    public set endColour(c : Colour) {
        [this.e1, this.e2, this.e3] = this.fromColour(c);
    }

    public get interpolation(): Interpolation {
        return this.interpMethod;
    }
    
    public get space(): ColourSpace {
        return this.colourSpace;
    }

    public set interpolation(interpolation: Interpolation) {
        this.interpMethod = interpolation;
        let { interpFtn, cyclicInterpFtn } = getInterpFtns(interpolation, this._longRoute);
        this.interpFtn = interpFtn;
        this.cyclicInterpFtn = cyclicInterpFtn;
    }
    
    public set space(space : ColourSpace) {
        this.colourSpace = space;
        let s = this.startColour, e = this.endColour;
        let { fromColour, toColour } = getCastingFtns(space);
        this.fromColour = fromColour;
        this.toColour = toColour;
        this.cyclicArg = getCyclicArg(space);
        this.startColour = s, this.endColour = e;
    }

    public get longRoute(): boolean {
        return this._longRoute;
    }

    public set longRoute(longRoute: boolean) {
        this._longRoute = longRoute;
        let { interpFtn, cyclicInterpFtn } = getInterpFtns(this.interpMethod, longRoute);
        this.interpFtn = interpFtn;
        this.cyclicInterpFtn = cyclicInterpFtn;
    }

    public override toString(): string {
        return `DirectGradient(${this.startColour}, ${this.endColour})`;
    }
}

export class JoinedGradient extends Object implements Gradient {

    private colours: Colour[];
    private colourSpaces: ColourSpace[];
    private interpMethods: Interpolation[];
    private lengths: number[];
    private longRoutes: boolean[];
    private cycles: number[];
    private factor: number

    /** represents a gradient between many colours, travelling an abstract route through colour space. */
    constructor(startColour: Colour, ... segments: GradientSegment[]) {
        super();

        this.colours = [startColour];
        this.colourSpaces = [];
        this.interpMethods = [];
        this.longRoutes = [];
        this.cycles = [];
        let lengths = [];

        for (const segment of segments) {
            if (segment.colour) this.colours.push(segment.colour);
            else if (segment.color) this.colours.push(segment.color);
            else throw new Error("A colour must be specified in all segments.");
            this.colourSpaces.push(segment.space ?? ColourSpace.RGB);
            this.interpMethods.push(segment.interpolation ?? Interpolation.linear);
            this.longRoutes.push(segment.longRoute ?? false);
            this.cycles.push(segment.cycles ?? 0);
            lengths.push(segment.length ?? 1);
        }

        this.factor = mathExt.sum(...lengths);

        this.lengths = mathExt.normalize_1D(lengths);
    }

    public getAt(t: number): Colour {
        let lt = t;
        let i = 0;
        for (; lt > this.lengths[i]; i++) lt -= this.lengths[i];
        lt /= this.lengths[i];
        let g = new DirectGradient(this.colours[i], this.colours[i+1], this.colourSpaces[i], this.interpMethods[i], this.longRoutes[i], this.cycles[i]);
        return g.getAt(lt);
    }

    /** get the contained gradient at index i */
    public getGradient(i: number): DirectGradient {
        return new DirectGradient(this.colours[i], this.colours[i+1], this.colourSpaces[i], this.interpMethods[i], this.longRoutes[i], this.cycles[i]);
    }

    /** set the contained gradient at index i */
    public setGradient(i: number, gradient: DirectGradient) {
        this.colours[i] = gradient.startColour;
        this.colours[i+1] = gradient.endColour;
        this.colourSpaces[i] = gradient.space;
        this.interpMethods[i] = gradient.interpolation;
        this.longRoutes[i] = gradient.longRoute;
        this.cycles[i] = gradient.cycles;
    }

    /** get the length of the contained gradient at index i */
    public getGradientLength(i: number): number {
        return this.lengths[i] * this.factor;
    }

    /** set the length of the contained gradient at index i */
    public setGradientLength(i: number, length: number) {
        let originalLengths = this.lengths;
        originalLengths.forEach((v, i) => originalLengths[i] = v * this.factor);
        originalLengths[i] = length;
        this.factor = mathExt.sum(...originalLengths);
        this.lengths = mathExt.normalize_1D(originalLengths);
    }

    public override toString(): string {
        return `JoinedGradient(${this.colours[0], this.colours[this.colours.length - 1]})`;
    }
}

/** used for segmented gradients */
export interface GradientSegment {
    colour?: Colour;
    color?: Color;
    length?: number;
    space?: ColourSpace;
    interpolation?: Interpolation;
    longRoute?: boolean;
    cycles?: number;
}

/** collects the appropriate casting functions for a given colour space */
function getCastingFtns(space: ColourSpace): CastingFtns {

    let fromColour: FromColFtn;
    let toColour: ToColFtn;

    switch (space) {
        case ColourSpace.RGB:
            fromColour = (c) => c.toRGB();
            toColour = (r, g, b) => new Colour(r, g, b);
            break;
        case ColourSpace.HSV:
            fromColour = (c) => c.toHSV();
            toColour = (h, s, v) => Colour.fromHSV(h, s, v);
            break;
        case ColourSpace.HSL:
            fromColour = (c) => c.toHSL();
            toColour = (h, s, l) => Colour.fromHSL(h, s, l);
            break;
        case ColourSpace.HSI:
            fromColour = (c) => c.toHSI();
            toColour = (h, s, i) => Colour.fromHSI(h, s, i);
            break;
        default:
            throw new Error("That colour space is not yet supported within in this function.");
    }

    return { toColour, fromColour };
}

/** collects the appropriate interpolation functions for a given interpolation method */
function getInterpFtns(interpolation: Interpolation, longRoute = false): InterpFtns {

    let interpFtn: InterpFtn;
    let cyclicInterpFtn: CyclicInterpFtn;

    switch (interpolation) {
        case Interpolation.linear:
            interpFtn = mathExt.lerp;
            cyclicInterpFtn = longRoute ? mathExt.cyclicLerp_long : mathExt.cyclicLerp_short;
            break;
        case Interpolation.inc_quadratic:
            interpFtn = mathExt.qerp_0;
            cyclicInterpFtn = longRoute ? mathExt.cyclicQerp_0_long : mathExt.cyclicQerp_0_short;
            break;
        case Interpolation.dec_quadratic:
            interpFtn = mathExt.qerp_1;
            cyclicInterpFtn = longRoute ? mathExt.cyclicQerp_1_long : mathExt.cyclicQerp_1_short;
            break;
        case Interpolation.cubic:
            interpFtn = mathExt.cubicInterp_deriv;
            cyclicInterpFtn = longRoute ? (t, a, b, cycles) => mathExt.cyclicCubicInterp_deriv_long(t, a, b, 0, 0, cycles) : (t, a, b, cycles) => mathExt.cyclicCubicInterp_deriv_short(t, a, b, 0, 0, cycles);
            break;
        default:
            throw new Error("That interpolation method is not yet supported within this function");
    }

    return { interpFtn, cyclicInterpFtn };
}

/** returns a number which indicates which components of a given colour system are cyclical */
function getCyclicArg(space: ColourSpace): number {
    return space == ColourSpace.RGB ? 0 : 0b100;
}
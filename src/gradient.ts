import { Color, ColorSpace } from "./color";
import * as mathExt from "./mathExt";

type InterpFtn = (t: number, a: number, b: number) => number;
type CyclicInterpFtn = (t: number, a: number, b: number, cycles?: number) => number;
type ToColFtn = (c1: number, c2: number, c3: number) => Color;
type FromColFtn = (c: Color) => number[];

/** the available interpolation methods supported by the library */
export enum Interpolation {
    linear,
    inc_quadratic,
    dec_quadratic,
    cubic,
}

interface CastingFtns {
    fromColor: FromColFtn;
    toColor: ToColFtn;
}

interface InterpFtns {
    interpFtn: InterpFtn;
    cyclicInterpFtn: CyclicInterpFtn;
}

/** any form of 1 dimensional gradient */
export interface Gradient {
    /** get the color at a specfic point along the gradient, range [0, 1] */
    getAt(t: number) : Color
}

export class DirectGradient extends Object implements Gradient {

    public cycles: number;

    // start color in easy to interpolate form
    private s1: number;
    private s2: number;
    private s3: number;

    // end color in easy to interpolate form
    private e1: number;
    private e2: number;
    private e3: number;

    private cyclicArg: number;

    private fromColor: FromColFtn;
    private toColor: ToColFtn;

    private interpFtn: InterpFtn;
    private cyclicInterpFtn: CyclicInterpFtn;

    private colorSpace: ColorSpace;
    private interpMethod: Interpolation;

    private _longRoute: boolean;

    /** represents a smooth gradient between two colors */
    constructor (startColor: Color, endColor: Color, space = ColorSpace.RGB, interpolation = Interpolation.linear, longRoute = false, cycles = 0) {
        super();

        this.colorSpace = space;
        this.interpMethod = interpolation;

        let {fromColor, toColor} = getCastingFtns(space);
        let {interpFtn, cyclicInterpFtn} = getInterpFtns(interpolation, longRoute);

        this._longRoute = longRoute;

        this.toColor = toColor;
        this.fromColor = fromColor;

        this.interpFtn = interpFtn;
        this.cyclicInterpFtn = cyclicInterpFtn;

        [this.s1, this.s2, this.s3] = fromColor(startColor);
        [this.e1, this.e2, this.e3] = fromColor(endColor);

        this.cyclicArg = getCyclicArg(space);

        this.cycles = cycles;
    }

    public getAt(t: number) : Color {
        return this.toColor(
            0b100 & this.cyclicArg ? this.cyclicInterpFtn(t, this.s1, this.e1, this.cycles) : this.interpFtn(t, this.s1, this.e1),
            0b010 & this.cyclicArg ? this.cyclicInterpFtn(t, this.s2, this.e2, this.cycles) : this.interpFtn(t, this.s2, this.e2),
            0b001 & this.cyclicArg ? this.cyclicInterpFtn(t, this.s3, this.e3, this.cycles) : this.interpFtn(t, this.s3, this.e3)
        );
    }

    public get startColor() : Color {
        return this.toColor(this.s1, this.s2, this.s3);
    }
    
    public get endColor() : Color {
        return this.toColor(this.e1, this.e2, this.e3);
    }
    
    public set startColor(c : Color) {
        [this.s1, this.s2, this.s3] = this.fromColor(c);
    }
    
    public set endColor(c : Color) {
        [this.e1, this.e2, this.e3] = this.fromColor(c);
    }
    
    public get interpolation() : Interpolation {
        return this.interpMethod;
    }
    
    public get space() : ColorSpace {
        return this.colorSpace;
    }
    
    public set interpolation(interpolation : Interpolation) {
        this.interpMethod = interpolation;
        let {interpFtn, cyclicInterpFtn} = getInterpFtns(interpolation, this._longRoute);
        this.interpFtn = interpFtn;
        this.cyclicInterpFtn = cyclicInterpFtn;
    }
    
    public set space(space : ColorSpace) {
        this.colorSpace = space;
        let s = this.startColor, e = this.endColor;
        let {fromColor, toColor} = getCastingFtns(space);
        this.fromColor = fromColor;
        this.toColor = toColor;
        this.cyclicArg = getCyclicArg(space);
        this.startColor = s, this.endColor = e;
    }
    
    public get longRoute() : boolean {
        return this._longRoute;
    }

    public set longRoute(longRoute: boolean) {
        this._longRoute = longRoute;
        let {interpFtn, cyclicInterpFtn} = getInterpFtns(this.interpMethod, longRoute);
        this.interpFtn = interpFtn;
        this.cyclicInterpFtn = cyclicInterpFtn;
    }

    public override toString() : string {
        return `DirectGradient(${this.startColor}, ${this.endColor})`;
    }
}

export class JoinedGradient extends Object implements Gradient {

    private colors: Color[];
    private colorSpaces: ColorSpace[];
    private interpMethods: Interpolation[];
    private lengths: number[];
    private longRoutes: boolean[];
    private cycles: number[];
    private factor: number

    /** represents a gradient between many colors, travelling an abstract route through color space. */
    constructor(startColor: Color, ... segments: GradientSegment[]) {
        super();

        this.colors = [startColor];
        this.colorSpaces = [];
        this.interpMethods = [];
        this.longRoutes = [];
        this.cycles = [];
        let lengths = [];

        for (const segment of segments) {
            this.colors.push(segment.color);
            this.colorSpaces.push(segment.space ?? ColorSpace.RGB);
            this.interpMethods.push(segment.interpolation ?? Interpolation.linear);
            this.longRoutes.push(segment.longRoute ?? false);
            this.cycles.push(segment.cycles ?? 0);
            lengths.push(segment.length ?? 1);
        }

        this.factor = mathExt.sum( ... lengths);

        this.lengths = mathExt.normalize_1D(lengths);
    }

    public getAt(t: number) : Color {
        let lt = t;
        let i = 0;
        for (; lt > this.lengths[i]; i++) lt -= this.lengths[i];
        lt /= this.lengths[i];
        let g = new DirectGradient(this.colors[i], this.colors[i+1], this.colorSpaces[i], this.interpMethods[i], this.longRoutes[i], this.cycles[i]);
        return g.getAt(lt);
    }
    
    /** get the contained gradient at index i */
    public getGradient(i: number) : DirectGradient {
        return new DirectGradient(this.colors[i], this.colors[i+1], this.colorSpaces[i], this.interpMethods[i], this.longRoutes[i], this.cycles[i]);
    }

    /** set the contained gradient at index i */
    public setGradient(i: number, gradient: DirectGradient) {
        this.colors[i] = gradient.startColor;
        this.colors[i+1] = gradient.endColor;
        this.colorSpaces[i] = gradient.space;
        this.interpMethods[i] = gradient.interpolation;
        this.longRoutes[i] = gradient.longRoute;
        this.cycles[i] = gradient.cycles;
    }

    /** get the length of the contained gradient at index i */
    public getGradientLength(i: number) : number {
        return this.lengths[i] * this.factor;
    }

    /** set the length of the contained gradient at index i */
    public setGradientLength(i: number, length: number) {
        let originalLengths = this.lengths;
        originalLengths.forEach((v, i) => originalLengths[i] = v * this.factor);
        originalLengths[i] = length;
        this.factor = mathExt.sum( ... originalLengths);
        this.lengths = mathExt.normalize_1D(originalLengths);
    }

    public override toString() : string {
        return `JoinedGradient(${this.colors[0], this.colors[this.colors.length - 1]})`;
    }
}

/** used for segmented gradients */
export interface GradientSegment {
    color: Color;
    length?: number;
    space?: ColorSpace;
    interpolation?: Interpolation;
    longRoute?: boolean;
    cycles?: number;
}

/** collects the appropriate casting functions for a given color space */
function getCastingFtns(space: ColorSpace) : CastingFtns {

    let fromColor: FromColFtn;
    let toColor: ToColFtn;

    switch (space) {
        case ColorSpace.RGB:
            fromColor = (c) => c.toRGB();
            toColor = (r, g, b) => new Color(r, g, b);
            break;
        case ColorSpace.HSV:
            fromColor = (c) => c.toHSV();
            toColor = (h, s, v) => Color.fromHSV(h, s, v);
            break;
        case ColorSpace.HSL:
            fromColor = (c) => c.toHSL();
            toColor = (h, s, l) => Color.fromHSL(h, s, l);
            break;
        case ColorSpace.HSI:
            fromColor = (c) => c.toHSI();
            toColor = (h, s, i) => Color.fromHSI(h, s, i);
            break;
        default:
            throw new Error("That color space is not yet supported within in this function.");
    }

    return {toColor, fromColor};
}

/** collects the appropriate interpolation functions for a given interpolation method */
function getInterpFtns(interpolation: Interpolation, longRoute = false) : InterpFtns {

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

    return {interpFtn, cyclicInterpFtn};
}

/** returns a number which indicates which components of a given color system are cyclical */
function getCyclicArg(space: ColorSpace) : number {
    return space == ColorSpace.RGB ? 0 : 0b100;
}
import { Color, ColorSpace } from "./color";
/** the available interpolation methods supported by the library */
export declare enum Interpolation {
    linear = 0,
    inc_quadratic = 1,
    dec_quadratic = 2,
    cubic = 3
}
/** any form of 1 dimensional gradient */
export interface Gradient {
    /** get the color at a specfic point along the gradient, range [0, 1] */
    getAt(t: number): Color;
}
export declare class DirectGradient extends Object implements Gradient {
    cycles: number;
    private s1;
    private s2;
    private s3;
    private e1;
    private e2;
    private e3;
    private cyclicArg;
    private fromColor;
    private toColor;
    private interpFtn;
    private cyclicInterpFtn;
    private colorSpace;
    private interpMethod;
    private _longRoute;
    /** represents a smooth gradient between two colors */
    constructor(startColor: Color, endColor: Color, space?: ColorSpace, interpolation?: Interpolation, longRoute?: boolean, cycles?: number);
    getAt(t: number): Color;
    get startColor(): Color;
    get endColor(): Color;
    set startColor(c: Color);
    set endColor(c: Color);
    get interpolation(): Interpolation;
    get space(): ColorSpace;
    set interpolation(interpolation: Interpolation);
    set space(space: ColorSpace);
    get longRoute(): boolean;
    set longRoute(longRoute: boolean);
    toString(): string;
}
export declare class JoinedGradient extends Object implements Gradient {
    private colors;
    private colorSpaces;
    private interpMethods;
    private lengths;
    private longRoutes;
    private cycles;
    private factor;
    /** represents a gradient between many colors, travelling an abstract route through color space. */
    constructor(startColor: Color, ...segments: GradientSegment[]);
    getAt(t: number): Color;
    /** get the contained gradient at index i */
    getGradient(i: number): DirectGradient;
    /** set the contained gradient at index i */
    setGradient(i: number, gradient: DirectGradient): void;
    /** get the length of the contained gradient at index i */
    getGradientLength(i: number): number;
    /** set the length of the contained gradient at index i */
    setGradientLength(i: number, length: number): void;
    toString(): string;
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
//# sourceMappingURL=gradient.d.ts.map
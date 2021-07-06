export declare class Color extends Object {
    private _r;
    private _g;
    private _b;
    private _a;
    /** class representing a digital presentable color */
    constructor(r: number, g: number, b: number, a?: number);
    /** export this color into RGB format */
    toRGB(): number[];
    /** export this color into RGBA format */
    toRGBA(): number[];
    /** export this color into 24-bit RGB */
    to24BitRGB(): number[];
    /** export this color into 32-bit RGBA */
    to32BitRGBA(): number[];
    /** export this color into HSV format */
    toHSV(): number[];
    /** export this color into HSL format */
    toHSL(): number[];
    /** export this color into HSI format */
    toHSI(): number[];
    toString(): string;
    /** the red component of this color in RGB format */
    get red(): number;
    set red(r: number);
    /** the green component of this color in RGB format */
    get green(): number;
    set green(g: number);
    /** the blue component of this color in RGB format */
    get blue(): number;
    set blue(b: number);
    /** the alpha channel of this color */
    get alpha(): number;
    set alpha(a: number);
    get r_8b(): number;
    get g_8b(): number;
    get b_8b(): number;
    get a_8b(): number;
    /** the chroma of this color */
    get chroma(): number;
    set chroma(c: number);
    /** the hue of this color */
    get hue(): number;
    set hue(h: number);
    /** the brightness of this color in HSI format */
    get intensity(): number;
    set intensity(i: number);
    /** the brightness of this color in HSV format */
    get value(): number;
    set value(v: number);
    /** the brightness of this color in HSL format */
    get lightness(): number;
    set lightness(l: number);
    /** the saturation of this color in HSV format */
    get saturation_V(): number;
    set saturation_V(s: number);
    /** the saturation of this color in HSL format */
    get saturation_L(): number;
    set saturation_L(s: number);
    /** the saturation of this color in HSI format */
    get saturation_I(): number;
    set saturation_I(s: number);
    static readonly ALICEBLUE: Color;
    static readonly ANTIQUEWHITE: Color;
    static readonly AQUA: Color;
    static readonly AQUAMARINE: Color;
    static readonly AZURE: Color;
    static readonly BEIGE: Color;
    static readonly BISQUE: Color;
    static readonly BLACK: Color;
    static readonly BLANCHEDALMOND: Color;
    static readonly BLUE: Color;
    static readonly BLUEVIOLET: Color;
    static readonly BROWN: Color;
    static readonly BURLYWOOD: Color;
    static readonly CADETBLUE: Color;
    static readonly CHARTREUSE: Color;
    static readonly CHOCOLATE: Color;
    static readonly CORAL: Color;
    static readonly CORNFLOWERBLUE: Color;
    static readonly CORNSILK: Color;
    static readonly CRIMSON: Color;
    static readonly CYAN: Color;
    static readonly DARKBLUE: Color;
    static readonly DARKCYAN: Color;
    static readonly DARKGOLDENROD: Color;
    static readonly DARKGRAY: Color;
    static readonly DARKGREY: Color;
    static readonly DARKGREEN: Color;
    static readonly DARKKHAKI: Color;
    static readonly DARKMAGENTA: Color;
    static readonly DARKOLIVEGREEN: Color;
    static readonly DARKORANGE: Color;
    static readonly DARKORCHID: Color;
    static readonly DARKRED: Color;
    static readonly DARKSALMON: Color;
    static readonly DARKSEAGREEN: Color;
    static readonly DARKSLATEBLUE: Color;
    static readonly DARKSLATEGRAY: Color;
    static readonly DARKSLATEGREY: Color;
    static readonly DARKTURQUOISE: Color;
    static readonly DARKVIOLET: Color;
    static readonly DEEPPINK: Color;
    static readonly DEEPSKYBLUE: Color;
    static readonly DIMGRAY: Color;
    static readonly DIMGREY: Color;
    static readonly DODGERBLUE: Color;
    static readonly FIREBRICK: Color;
    static readonly FLORALWHITE: Color;
    static readonly FORESTGREEN: Color;
    static readonly FUCHSIA: Color;
    static readonly GAINSBORO: Color;
    static readonly GHOSTWHITE: Color;
    static readonly GOLD: Color;
    static readonly GOLDENROD: Color;
    static readonly GRAY: Color;
    static readonly GREY: Color;
    static readonly GREEN: Color;
    static readonly GREENYELLOW: Color;
    static readonly HONEYDEW: Color;
    static readonly HOTPINK: Color;
    static readonly INDIANRED: Color;
    static readonly INDIGO: Color;
    static readonly IVORY: Color;
    static readonly KHAKI: Color;
    static readonly LAVENDER: Color;
    static readonly LAVENDERBLUSH: Color;
    static readonly LAWNGREEN: Color;
    static readonly LEMONCHIFFON: Color;
    static readonly LIGHTBLUE: Color;
    static readonly LIGHTCORAL: Color;
    static readonly LIGHTCYAN: Color;
    static readonly LIGHTGOLDENRODYELLOW: Color;
    static readonly LIGHTGRAY: Color;
    static readonly LIGHTGREY: Color;
    static readonly LIGHTGREEN: Color;
    static readonly LIGHTPINK: Color;
    static readonly LIGHTSALMON: Color;
    static readonly LIGHTSEAGREEN: Color;
    static readonly LIGHTSKYBLUE: Color;
    static readonly LIGHTSLATEGRAY: Color;
    static readonly LIGHTSLATEGREY: Color;
    static readonly LIGHTSTEELBLUE: Color;
    static readonly LIGHTYELLOW: Color;
    static readonly LIME: Color;
    static readonly LIMEGREEN: Color;
    static readonly LINEN: Color;
    static readonly MAGENTA: Color;
    static readonly MAROON: Color;
    static readonly MEDIUMAQUAMARINE: Color;
    static readonly MEDIUMBLUE: Color;
    static readonly MEDIUMORCHID: Color;
    static readonly MEDIUMPURPLE: Color;
    static readonly MEDIUMSEAGREEN: Color;
    static readonly MEDIUMSLATEBLUE: Color;
    static readonly MEDIUMSPRINGGREEN: Color;
    static readonly MEDIUMTURQUOISE: Color;
    static readonly MEDIUMVIOLETRED: Color;
    static readonly MIDNIGHTBLUE: Color;
    static readonly MINTCREAM: Color;
    static readonly MISTYROSE: Color;
    static readonly MOCCASIN: Color;
    static readonly NAVAJOWHITE: Color;
    static readonly NAVY: Color;
    static readonly OLDLACE: Color;
    static readonly OLIVE: Color;
    static readonly OLIVEDRAB: Color;
    static readonly ORANGE: Color;
    static readonly ORANGERED: Color;
    static readonly ORCHID: Color;
    static readonly PALEGOLDENROD: Color;
    static readonly PALEGREEN: Color;
    static readonly PALETURQUOISE: Color;
    static readonly PALEVIOLETRED: Color;
    static readonly PAPAYAWHIP: Color;
    static readonly PEACHPUFF: Color;
    static readonly PERU: Color;
    static readonly PINK: Color;
    static readonly PLUM: Color;
    static readonly POWDERBLUE: Color;
    static readonly PURPLE: Color;
    static readonly REBECCAPURPLE: Color;
    static readonly RED: Color;
    static readonly ROSYBROWN: Color;
    static readonly ROYALBLUE: Color;
    static readonly SADDLEBROWN: Color;
    static readonly SALMON: Color;
    static readonly SANDYBROWN: Color;
    static readonly SEAGREEN: Color;
    static readonly SEASHELL: Color;
    static readonly SIENNA: Color;
    static readonly SILVER: Color;
    static readonly SKYBLUE: Color;
    static readonly SLATEBLUE: Color;
    static readonly SLATEGRAY: Color;
    static readonly SLATEGREY: Color;
    static readonly SNOW: Color;
    static readonly SPRINGGREEN: Color;
    static readonly STEELBLUE: Color;
    static readonly TAN: Color;
    static readonly TEAL: Color;
    static readonly THISTLE: Color;
    /** create a color from a corresponding hex value */
    static fromHex(hex: string): Color;
    /** create a color from HSV format */
    static fromHSV(hue: number, saturation: number, value: number, alpha?: number): Color;
    /** create a color from HSL format */
    static fromHSL(hue: number, saturation: number, lightness: number, alpha?: number): Color;
    /** create a color from HSI format */
    static fromHSI(hue: number, saturation: number, intensity: number, alpha?: number): Color;
    private static fromCXM;
}
/** the available color spaces supported by the library */
export declare enum ColorSpace {
    RGB = 0,
    HSV = 1,
    HSL = 2,
    HSI = 3
}
//# sourceMappingURL=color.d.ts.map
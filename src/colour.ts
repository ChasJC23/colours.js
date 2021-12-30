import { avg, mid } from "./mathExt";

export class Colour extends Object {

    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    /** class representing a digital presentable colour */
    public constructor(r: number | bigint, g: number | bigint, b: number | bigint, a: number | bigint = 1) {
        super();
        this._r = typeof r == "number" ? Math.min(Math.max(r, 0), 1) : Number(r) / 255;
        this._g = typeof g == "number" ? Math.min(Math.max(g, 0), 1) : Number(g) / 255;
        this._b = typeof b == "number" ? Math.min(Math.max(b, 0), 1) : Number(b) / 255;
        this._a = typeof a == "number" ? Math.min(Math.max(a, 0), 1) : Number(a) / 255;
    }

    /** export this colour into RGB format */
    public toRGB() {
        return [this._r, this._g, this._b];
    }

    /** export this colour into RGBA format */
    public toRGBA() {
        return [this._r, this._g, this._b, this._a];
    }

    /** export this colour into 24-bit RGB */
    public to24BitRGB() {
        return [this.r_8b, this.g_8b, this.b_8b];
    }

    /** export this colour into 32-bit RGBA */
    public to32BitRGBA() {
        return [this.r_8b, this.g_8b, this.b_8b, this.a_8b];
    }

    /** export this colour into HSV format */
    public toHSV() {
        return [this.hue, this.saturation_V, this.value];
    }

    /** export this colour into HSL format */
    public toHSL() {
        return [this.hue, this.saturation_L, this.lightness];
    }

    /** export this colour into HSI format */
    public toHSI() {
        return [this.hue, this.saturation_I, this.intensity];
    }

    public override toString() : string {
        return `Colour(r: ${this.red}, g: ${this.green}, b: ${this.blue})`;
    }

    /** the red component of this colour in RGB format */
    public get red() : number {
        return this._r;
    }

    public set red(r: number) {
        this._r = Math.min(Math.max(r, 0), 1);
    }

    /** the green component of this colour in RGB format */
    public get green() : number {
        return this._g;
    }

    public set green(g: number) {
        this._g = Math.min(Math.max(g, 0), 1);
    }

    /** the blue component of this colour in RGB format */
    public get blue() : number {
        return this._b;
    }

    public set blue(b: number) {
        this._b = Math.min(Math.max(b, 0), 1);
    }

    /** the alpha channel of this colour */
    public get alpha() : number {
        return this._a;
    }

    public set alpha(a: number) {
        this._a = Math.min(Math.max(a, 0), 1);
    }

    public get r_8b() : number { return Math.round(this._r * 0xFF); }
    public get g_8b() : number { return Math.round(this._g * 0xFF); }
    public get b_8b() : number { return Math.round(this._b * 0xFF); }
    public get a_8b() : number { return Math.round(this._a * 0xFF); }

    /** the chroma of this colour */
    public get chroma() : number {
        return Math.max(this._r, this._g, this._b) - Math.min(this._r, this._g, this._b);
    }
    public set chroma(c: number) {
        if (c < 0) c = 0;
        let i = this.intensity;
        let oc = this.chroma;
        this._r = (this._r - i) * c / oc + i;
        this._g = (this._g - i) * c / oc + i;
        this._b = (this._b - i) * c / oc + i;
    }
    
    /** the hue of this colour */
    public get hue() : number {
        if (this.chroma == 0) return 0;
        let hprime: number;
        switch (Math.max(this._r, this._g, this._b)) {
            case this._r:
                hprime = ((this._g - this._b) / this.chroma + 6) % 6;
                break;
            case this._g:
                hprime = (this._b - this._r) / this.chroma + 2;
                break;
            case this._b:
                hprime = (this._r - this._g) / this.chroma + 4;
                break;
            default:
                hprime = 0;
                break;
        }
        return hprime / 6;
    }
    public set hue(h: number) {
        let replacements = Colour.fromHSV(h, this.saturation_V, this.value);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the brightness of this colour in HSI format */
    public get intensity() : number {
        return avg(this._r, this._g, this._b);
    }
    public set intensity(i: number) {
        let replacements = Colour.fromHSI(this.hue, this.saturation_I, i);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the brightness of this colour in HSV format */
    public get value() : number {
        return Math.max(this._r, this._g, this._b);
    }
    public set value(v: number) {
        let replacements = Colour.fromHSV(this.hue, this.saturation_V, v);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }
    
    /** the brightness of this colour in HSL format */
    public get lightness() : number {
        return mid(this._r, this._g, this._b);
    }
    public set lightness(l: number) {
        let replacements = Colour.fromHSL(this.hue, this.saturation_L, l);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the saturation of this colour in HSV format */
    public get saturation_V() : number {
        return this.value == 0 ? 0 : this.chroma / this.value;
    }
    public set saturation_V(s: number) {
        let replacements = Colour.fromHSV(this.hue, s, this.value);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the saturation of this colour in HSL format */
    public get saturation_L() : number {
        return this.lightness % 1 == 0 ? 0 : this.chroma / (1 - Math.abs(2 * this.lightness - 1));
    }
    public set saturation_L(s: number) {
        let replacements = Colour.fromHSL(this.hue, s, this.lightness);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the saturation of this colour in HSI format */
    public get saturation_I() : number {
        return this.intensity == 0 ? 0 : 1 - Math.min(this._r, this._g, this._b) / this.intensity;
    }
    public set saturation_I(s: number) {
        let replacements = Colour.fromHSI(this.hue, s, this.intensity);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    //#region defaults
    public static readonly ALICEBLUE            = Colour.fromHex("#F0F8FF");
    public static readonly ANTIQUEWHITE         = Colour.fromHex("#FAEBD7");
    public static readonly AQUA                 = Colour.fromHex("#00FFFF");
    public static readonly AQUAMARINE           = Colour.fromHex("#7FFFD4");
    public static readonly AZURE                = Colour.fromHex("#F0FFFF");
    public static readonly BEIGE                = Colour.fromHex("#F5F5DC");
    public static readonly BISQUE               = Colour.fromHex("#FFE4C4");
    public static readonly BLACK                = Colour.fromHex("#000000");
    public static readonly BLANCHEDALMOND       = Colour.fromHex("#FFEBCD");
    public static readonly BLUE                 = Colour.fromHex("#0000FF");
    public static readonly BLUEVIOLET           = Colour.fromHex("#8A2BE2");
    public static readonly BROWN                = Colour.fromHex("#A52A2A");
    public static readonly BURLYWOOD            = Colour.fromHex("#DEB887");
    public static readonly CADETBLUE            = Colour.fromHex("#5F9EA0");
    public static readonly CHARTREUSE           = Colour.fromHex("#7FFF00");
    public static readonly CHOCOLATE            = Colour.fromHex("#D2691E");
    public static readonly CORAL                = Colour.fromHex("#FF7F50");
    public static readonly CORNFLOWERBLUE       = Colour.fromHex("#6495ED");
    public static readonly CORNSILK             = Colour.fromHex("#FFF8DC");
    public static readonly CRIMSON              = Colour.fromHex("#DC143C");
    public static readonly CYAN                 = Colour.fromHex("#00FFFF");
    public static readonly DARKBLUE             = Colour.fromHex("#00008B");
    public static readonly DARKCYAN             = Colour.fromHex("#008B8B");
    public static readonly DARKGOLDENROD        = Colour.fromHex("#B8860B");
    public static readonly DARKGRAY             = Colour.fromHex("#A9A9A9");
    public static readonly DARKGREY             = Colour.fromHex("#A9A9A9");
    public static readonly DARKGREEN            = Colour.fromHex("#006400");
    public static readonly DARKKHAKI            = Colour.fromHex("#BDB76B");
    public static readonly DARKMAGENTA          = Colour.fromHex("#8B008B");
    public static readonly DARKOLIVEGREEN       = Colour.fromHex("#556B2F");
    public static readonly DARKORANGE           = Colour.fromHex("#FF8C00");
    public static readonly DARKORCHID           = Colour.fromHex("#9932CC");
    public static readonly DARKRED              = Colour.fromHex("#8B0000");
    public static readonly DARKSALMON           = Colour.fromHex("#E9967A");
    public static readonly DARKSEAGREEN         = Colour.fromHex("#8FBC8F");
    public static readonly DARKSLATEBLUE        = Colour.fromHex("#483D8B");
    public static readonly DARKSLATEGRAY        = Colour.fromHex("#2F4F4F");
    public static readonly DARKSLATEGREY        = Colour.fromHex("#2F4F4F");
    public static readonly DARKTURQUOISE        = Colour.fromHex("#00CED1");
    public static readonly DARKVIOLET           = Colour.fromHex("#9400D3");
    public static readonly DEEPPINK             = Colour.fromHex("#FF1493");
    public static readonly DEEPSKYBLUE          = Colour.fromHex("#00BFFF");
    public static readonly DIMGRAY              = Colour.fromHex("#696969");
    public static readonly DIMGREY              = Colour.fromHex("#696969");
    public static readonly DODGERBLUE           = Colour.fromHex("#1E90FF");
    public static readonly FIREBRICK            = Colour.fromHex("#B22222");
    public static readonly FLORALWHITE          = Colour.fromHex("#FFFAF0");
    public static readonly FORESTGREEN          = Colour.fromHex("#228B22");
    public static readonly FUCHSIA              = Colour.fromHex("#FF00FF");
    public static readonly GAINSBORO            = Colour.fromHex("#DCDCDC");
    public static readonly GHOSTWHITE           = Colour.fromHex("#F8F8FF");
    public static readonly GOLD                 = Colour.fromHex("#FFD700");
    public static readonly GOLDENROD            = Colour.fromHex("#DAA520");
    public static readonly GRAY                 = Colour.fromHex("#808080");
    public static readonly GREY                 = Colour.fromHex("#808080");
    public static readonly GREEN                = Colour.fromHex("#008000");
    public static readonly GREENYELLOW          = Colour.fromHex("#ADFF2F");
    public static readonly HONEYDEW             = Colour.fromHex("#F0FFF0");
    public static readonly HOTPINK              = Colour.fromHex("#FF69B4");
    public static readonly INDIANRED            = Colour.fromHex("#CD5C5C");
    public static readonly INDIGO               = Colour.fromHex("#4B0082");
    public static readonly IVORY                = Colour.fromHex("#FFFFF0");
    public static readonly KHAKI                = Colour.fromHex("#F0E68C");
    public static readonly LAVENDER             = Colour.fromHex("#E6E6FA");
    public static readonly LAVENDERBLUSH        = Colour.fromHex("#FFF0F5");
    public static readonly LAWNGREEN            = Colour.fromHex("#7CFC00");
    public static readonly LEMONCHIFFON         = Colour.fromHex("#FFFACD");
    public static readonly LIGHTBLUE            = Colour.fromHex("#ADD8E6");
    public static readonly LIGHTCORAL           = Colour.fromHex("#F08080");
    public static readonly LIGHTCYAN            = Colour.fromHex("#E0FFFF");
    public static readonly LIGHTGOLDENRODYELLOW = Colour.fromHex("#FAFAD2");
    public static readonly LIGHTGRAY            = Colour.fromHex("#D3D3D3");
    public static readonly LIGHTGREY            = Colour.fromHex("#D3D3D3");
    public static readonly LIGHTGREEN           = Colour.fromHex("#90EE90");
    public static readonly LIGHTPINK            = Colour.fromHex("#FFB6C1");
    public static readonly LIGHTSALMON          = Colour.fromHex("#FFA07A");
    public static readonly LIGHTSEAGREEN        = Colour.fromHex("#20B2AA");
    public static readonly LIGHTSKYBLUE         = Colour.fromHex("#87CEFA");
    public static readonly LIGHTSLATEGRAY       = Colour.fromHex("#778899");
    public static readonly LIGHTSLATEGREY       = Colour.fromHex("#778899");
    public static readonly LIGHTSTEELBLUE       = Colour.fromHex("#B0C4DE");
    public static readonly LIGHTYELLOW          = Colour.fromHex("#FFFFE0");
    public static readonly LIME                 = Colour.fromHex("#00FF00");
    public static readonly LIMEGREEN            = Colour.fromHex("#32CD32");
    public static readonly LINEN                = Colour.fromHex("#FAF0E6");
    public static readonly MAGENTA              = Colour.fromHex("#FF00FF");
    public static readonly MAROON               = Colour.fromHex("#800000");
    public static readonly MEDIUMAQUAMARINE     = Colour.fromHex("#66CDAA");
    public static readonly MEDIUMBLUE           = Colour.fromHex("#0000CD");
    public static readonly MEDIUMORCHID         = Colour.fromHex("#BA55D3");
    public static readonly MEDIUMPURPLE         = Colour.fromHex("#9370DB");
    public static readonly MEDIUMSEAGREEN       = Colour.fromHex("#3CB371");
    public static readonly MEDIUMSLATEBLUE      = Colour.fromHex("#7B68EE");
    public static readonly MEDIUMSPRINGGREEN    = Colour.fromHex("#00FA9A");
    public static readonly MEDIUMTURQUOISE      = Colour.fromHex("#48D1CC");
    public static readonly MEDIUMVIOLETRED      = Colour.fromHex("#C71585");
    public static readonly MIDNIGHTBLUE         = Colour.fromHex("#191970");
    public static readonly MINTCREAM            = Colour.fromHex("#F5FFFA");
    public static readonly MISTYROSE            = Colour.fromHex("#FFE4E1");
    public static readonly MOCCASIN             = Colour.fromHex("#FFE4B5");
    public static readonly NAVAJOWHITE          = Colour.fromHex("#FFDEAD");
    public static readonly NAVY                 = Colour.fromHex("#000080");
    public static readonly OLDLACE              = Colour.fromHex("#FDF5E6");
    public static readonly OLIVE                = Colour.fromHex("#808000");
    public static readonly OLIVEDRAB            = Colour.fromHex("#6B8E23");
    public static readonly ORANGE               = Colour.fromHex("#FFA500");
    public static readonly ORANGERED            = Colour.fromHex("#FF4500");
    public static readonly ORCHID               = Colour.fromHex("#DA70D6");
    public static readonly PALEGOLDENROD        = Colour.fromHex("#EEE8AA");
    public static readonly PALEGREEN            = Colour.fromHex("#98FB98");
    public static readonly PALETURQUOISE        = Colour.fromHex("#AFEEEE");
    public static readonly PALEVIOLETRED        = Colour.fromHex("#DB7093");
    public static readonly PAPAYAWHIP           = Colour.fromHex("#FFEFD5");
    public static readonly PEACHPUFF            = Colour.fromHex("#FFDAB9");
    public static readonly PERU                 = Colour.fromHex("#CD853F");
    public static readonly PINK                 = Colour.fromHex("#FFC0CB");
    public static readonly PLUM                 = Colour.fromHex("#DDA0DD");
    public static readonly POWDERBLUE           = Colour.fromHex("#B0E0E6");
    public static readonly PURPLE               = Colour.fromHex("#800080");
    public static readonly REBECCAPURPLE        = Colour.fromHex("#663399");
    public static readonly RED                  = Colour.fromHex("#FF0000");
    public static readonly ROSYBROWN            = Colour.fromHex("#BC8F8F");
    public static readonly ROYALBLUE            = Colour.fromHex("#4169E1");
    public static readonly SADDLEBROWN          = Colour.fromHex("#8B4513");
    public static readonly SALMON               = Colour.fromHex("#FA8072");
    public static readonly SANDYBROWN           = Colour.fromHex("#F4A460");
    public static readonly SEAGREEN             = Colour.fromHex("#2E8B57");
    public static readonly SEASHELL             = Colour.fromHex("#FFF5EE");
    public static readonly SIENNA               = Colour.fromHex("#A0522D");
    public static readonly SILVER               = Colour.fromHex("#C0C0C0");
    public static readonly SKYBLUE              = Colour.fromHex("#87CEEB");
    public static readonly SLATEBLUE            = Colour.fromHex("#6A5ACD");
    public static readonly SLATEGRAY            = Colour.fromHex("#708090");
    public static readonly SLATEGREY            = Colour.fromHex("#708090");
    public static readonly SNOW                 = Colour.fromHex("#FFFAFA");
    public static readonly SPRINGGREEN          = Colour.fromHex("#00FF7F");
    public static readonly STEELBLUE            = Colour.fromHex("#4682B4");
    public static readonly TAN                  = Colour.fromHex("#D2B48C");
    public static readonly TEAL                 = Colour.fromHex("#008080");
    public static readonly THISTLE              = Colour.fromHex("#D8BFD8");
    public static readonly TOMATO               = Colour.fromHex("#FF6347");
    public static readonly TURQUOISE            = Colour.fromHex("#40E0D0");
    public static readonly VIOLET               = Colour.fromHex("#EE82EE");
    public static readonly WHEAT                = Colour.fromHex("#F5DEB3");
    public static readonly WHITE                = Colour.fromHex("#FFFFFF");
    public static readonly WHITESMOKE           = Colour.fromHex("#F5F5F5");
    public static readonly YELLOW               = Colour.fromHex("#FFFF00");
    public static readonly YELLOWGREEN          = Colour.fromHex("#9ACD32");
    //#endregion

    /** create a colour from a corresponding hex value */
    public static fromHex(hex: string) {

        // remove any leading formatting characters
        hex = hex.replace("#", "").replace("0x", "");
    
        const colourValue = Number.parseInt(hex, 16);
    
        let r: number;
        let g: number;
        let b: number;
    
        switch (hex.length) {
    
            // 8-bit colour
            case 2:
                r = (colourValue & 0b1110_0000) / 0b1110_0000;
                g = (colourValue & 0b0001_1100) / 0b0001_1100;
                b = (colourValue & 0b0000_0011) / 0b0000_0011;
                break;
    
            // 12-bit colour
            case 3:
                r = (colourValue & 0xF00) / 0xF00;
                g = (colourValue & 0x0F0) / 0x0F0;
                b = (colourValue & 0x00F) / 0x00F;
                break;
    
            // 16-bit colour
            case 4:
                r = (colourValue & 0xF800) / 0xF800;
                g = (colourValue & 0x07E0) / 0x07E0;
                b = (colourValue & 0x001F) / 0x001F;
                break;
    
            // 24-bit colour
            case 6:
                r = (colourValue & 0xFF_00_00) / 0xFF_00_00;
                g = (colourValue & 0x00_FF_00) / 0x00_FF_00;
                b = (colourValue & 0x00_00_FF) / 0x00_00_FF;
                break;
            
            // 36-bit colour
            case 9:
                r = (colourValue & 0xFFF_000_000) / 0xFFF_000_000;
                g = (colourValue & 0x000_FFF_000) / 0x000_FFF_000;
                b = (colourValue & 0x000_000_FFF) / 0x000_000_FFF;
                break;
            
            // 48-bit colour
            case 12:
                r = (colourValue & 0xFFFF_0000_0000) / 0xFFFF_0000_0000;
                g = (colourValue & 0x0000_FFFF_0000) / 0x0000_FFFF_0000;
                b = (colourValue & 0x0000_0000_FFFF) / 0x0000_0000_FFFF;
                break;
    
            default:
                throw new Error("Invalid colour format");
        }
    
        return new Colour(r, g, b);
    }

    /** create a colour from HSV format */
    public static fromHSV(hue: number, saturation: number, value: number, alpha = 1) : Colour {

        const chroma = value * saturation;
        const scaledHue = hue * 6;
    
        // integer to isolate the 6 separate cases for hue
        const hueRegion = Math.floor(scaledHue);
    
        // intermediate value for second largest component
        const X = chroma * (1 - Math.abs(scaledHue % 2 - 1));
    
        // constant to add to all colour components
        const m = value - chroma;
    
        return Colour.fromCXM(hueRegion, chroma, X, m, alpha);
    }

    /** create a colour from HSL format */
    public static fromHSL(hue: number, saturation: number, lightness: number, alpha = 1) : Colour {

        const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const scaledHue = hue * 6;
    
        // integer to isolate the 6 separate cases for hue
        const hueRegion = Math.floor(scaledHue);
    
        // intermediate value for second largest component
        const X = chroma * (1 - Math.abs(scaledHue % 2 - 1));
    
        // constant to add to all colour components
        const m = lightness - chroma * 0.5;
    
        return Colour.fromCXM(hueRegion, chroma, X, m, alpha);
    }

    /** create a colour from HSI format */
    public static fromHSI(hue: number, saturation: number, intensity: number, alpha = 1) : Colour {

        const scaledHue = hue * 6;
    
        // integer to isolate the 6 separate cases for hue
        const hueRegion = Math.floor(scaledHue);
    
        const Z = 1 - Math.abs(scaledHue % 2 - 1);
    
        const chroma = 3 * intensity * saturation / (1 + Z);
    
        // intermediate value for second largest component
        const X = chroma * Z;
    
        // constant to add to all colour components
        const m = intensity * (1 - saturation);
    
        return Colour.fromCXM(hueRegion, chroma, X, m, alpha);
    }

    /** create a colour from 24-bit RGB format */
    public static from24BitRGB(r: number, g: number, b: number): Colour {
        return this.from32BitRGBA(r, g, b);
    }

    /** create a colour from 32-bit RGBA format */
    public static from32BitRGBA(r: number, g: number, b: number, a?: number): Colour {
        return new Colour(r / 0xFF, g / 0xFF, b / 0xFF, a ? a / 0xFF : 1);
    }

    private static fromCXM(hueRegion: number, chroma: number, X: number, m: number, alpha: number) {

        switch (hueRegion) {
            case 0: // red to yellow
                return new Colour(chroma + m, X + m, m, alpha);
            case 1: // yellow to green
                return new Colour(X + m, chroma + m, m, alpha);
            case 2: // green to cyan
                return new Colour(m, chroma + m, X + m, alpha);
            case 3: // cyan to blue
                return new Colour(m, X + m, chroma + m, alpha);
            case 4: // blue to magenta
                return new Colour(X + m, m, chroma + m, alpha);
            case 5: // magenta to red
                return new Colour(chroma + m, m, X + m, alpha);
            default:
                return Colour.BLACK;
        }
    }
}

export class Color extends Colour {};

/** the available colour spaces supported by the library */
export enum ColourSpace {
    RGB,
    HSV,
    HSL,
    HSI,
}

export const ColorSpace = ColourSpace;
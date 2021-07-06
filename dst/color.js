(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./mathExt"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ColorSpace = exports.Color = void 0;
    const mathExt_1 = require("./mathExt");
    class Color extends Object {
        /** class representing a digital presentable color */
        constructor(r, g, b, a = 1) {
            super();
            this._r = Math.min(Math.max(r, 0), 1);
            this._g = Math.min(Math.max(g, 0), 1);
            this._b = Math.min(Math.max(b, 0), 1);
            this._a = Math.min(Math.max(a, 0), 1);
        }
        /** export this color into RGB format */
        toRGB() {
            return [this._r, this._g, this._b];
        }
        /** export this color into RGBA format */
        toRGBA() {
            return [this._r, this._g, this._b, this._a];
        }
        /** export this color into 24-bit RGB */
        to24BitRGB() {
            return [this.r_8b, this.g_8b, this.b_8b];
        }
        /** export this color into 32-bit RGBA */
        to32BitRGBA() {
            return [this.r_8b, this.g_8b, this.b_8b, this.a_8b];
        }
        /** export this color into HSV format */
        toHSV() {
            return [this.hue, this.saturation_V, this.value];
        }
        /** export this color into HSL format */
        toHSL() {
            return [this.hue, this.saturation_L, this.lightness];
        }
        /** export this color into HSI format */
        toHSI() {
            return [this.hue, this.saturation_I, this.intensity];
        }
        toString() {
            return `Color(r: ${this.red}, g: ${this.green}, b: ${this.blue})`;
        }
        /** the red component of this color in RGB format */
        get red() {
            return this._r;
        }
        set red(r) {
            this._r = Math.min(Math.max(r, 0), 1);
        }
        /** the green component of this color in RGB format */
        get green() {
            return this._g;
        }
        set green(g) {
            this._g = Math.min(Math.max(g, 0), 1);
        }
        /** the blue component of this color in RGB format */
        get blue() {
            return this._b;
        }
        set blue(b) {
            this._b = Math.min(Math.max(b, 0), 1);
        }
        /** the alpha channel of this color */
        get alpha() {
            return this._a;
        }
        set alpha(a) {
            this._a = Math.min(Math.max(a, 0), 1);
        }
        get r_8b() { return Math.floor(this._r * 0xFF); }
        get g_8b() { return Math.floor(this._g * 0xFF); }
        get b_8b() { return Math.floor(this._b * 0xFF); }
        get a_8b() { return Math.floor(this._a * 0xFF); }
        /** the chroma of this color */
        get chroma() {
            return Math.max(this._r, this._g, this._b) - Math.min(this._r, this._g, this._b);
        }
        set chroma(c) {
            if (c < 0)
                c = 0;
            let i = this.intensity;
            let oc = this.chroma;
            this._r = (this._r - i) * c / oc + i;
            this._g = (this._g - i) * c / oc + i;
            this._b = (this._b - i) * c / oc + i;
        }
        /** the hue of this color */
        get hue() {
            if (this.chroma == 0)
                return 0;
            let hprime;
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
        set hue(h) {
            let replacements = Color.fromHSV(h, this.saturation_V, this.value);
            this._r = replacements._r;
            this._g = replacements._g;
            this._b = replacements._b;
        }
        /** the brightness of this color in HSI format */
        get intensity() {
            return mathExt_1.avg(this._r, this._g, this._b);
        }
        set intensity(i) {
            let replacements = Color.fromHSI(this.hue, this.saturation_I, i);
            this._r = replacements._r;
            this._g = replacements._g;
            this._b = replacements._b;
        }
        /** the brightness of this color in HSV format */
        get value() {
            return Math.max(this._r, this._g, this._b);
        }
        set value(v) {
            let replacements = Color.fromHSV(this.hue, this.saturation_V, v);
            this._r = replacements._r;
            this._g = replacements._g;
            this._b = replacements._b;
        }
        /** the brightness of this color in HSL format */
        get lightness() {
            return mathExt_1.mid(this._r, this._g, this._b);
        }
        set lightness(l) {
            let replacements = Color.fromHSL(this.hue, this.saturation_L, l);
            this._r = replacements._r;
            this._g = replacements._g;
            this._b = replacements._b;
        }
        /** the saturation of this color in HSV format */
        get saturation_V() {
            return this.value == 0 ? 0 : this.chroma / this.value;
        }
        set saturation_V(s) {
            let replacements = Color.fromHSV(this.hue, s, this.value);
            this._r = replacements._r;
            this._g = replacements._g;
            this._b = replacements._b;
        }
        /** the saturation of this color in HSL format */
        get saturation_L() {
            return this.lightness % 1 == 0 ? 0 : this.chroma / (1 - Math.abs(2 * this.lightness - 1));
        }
        set saturation_L(s) {
            let replacements = Color.fromHSL(this.hue, s, this.lightness);
            this._r = replacements._r;
            this._g = replacements._g;
            this._b = replacements._b;
        }
        /** the saturation of this color in HSI format */
        get saturation_I() {
            return this.intensity == 0 ? 0 : 1 - Math.min(this._r, this._g, this._b) / this.intensity;
        }
        set saturation_I(s) {
            let replacements = Color.fromHSI(this.hue, s, this.intensity);
            this._r = replacements._r;
            this._g = replacements._g;
            this._b = replacements._b;
        }
        //#endregion
        /** create a color from a corresponding hex value */
        static fromHex(hex) {
            // remove any leading formatting characters
            hex = hex.replace("#", "").replace("0x", "");
            const colorValue = Number.parseInt(hex, 16);
            let r;
            let g;
            let b;
            switch (hex.length) {
                // 8-bit color
                case 2:
                    r = (colorValue & 224) / 224;
                    g = (colorValue & 28) / 28;
                    b = (colorValue & 3) / 3;
                    break;
                // 12-bit color
                case 3:
                    r = (colorValue & 0xF00) / 0xF00;
                    g = (colorValue & 0x0F0) / 0x0F0;
                    b = (colorValue & 0x00F) / 0x00F;
                    break;
                // 16-bit color
                case 4:
                    r = (colorValue & 0xF800) / 0xF800;
                    g = (colorValue & 0x07E0) / 0x07E0;
                    b = (colorValue & 0x001F) / 0x001F;
                    break;
                // 24-bit color
                case 6:
                    r = (colorValue & 16711680) / 16711680;
                    g = (colorValue & 65280) / 65280;
                    b = (colorValue & 255) / 255;
                    break;
                // 36-bit color
                case 9:
                    r = (colorValue & 68702699520) / 68702699520;
                    g = (colorValue & 16773120) / 16773120;
                    b = (colorValue & 4095) / 4095;
                    break;
                // 48-bit color
                case 12:
                    r = (colorValue & 281470681743360) / 281470681743360;
                    g = (colorValue & 4294901760) / 4294901760;
                    b = (colorValue & 65535) / 65535;
                    break;
                default:
                    throw new Error("Invalid color format");
            }
            return new Color(r, g, b);
        }
        /** create a color from HSV format */
        static fromHSV(hue, saturation, value, alpha = 1) {
            const chroma = value * saturation;
            const scaledHue = hue * 6;
            // integer to isolate the 6 separate cases for hue
            const hueRegion = Math.floor(scaledHue);
            // intermediate value for second largest component
            const X = chroma * (1 - Math.abs(scaledHue % 2 - 1));
            // constant to add to all colour components
            const m = value - chroma;
            return Color.fromCXM(hueRegion, chroma, X, m, alpha);
        }
        /** create a color from HSL format */
        static fromHSL(hue, saturation, lightness, alpha = 1) {
            const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
            const scaledHue = hue * 6;
            // integer to isolate the 6 separate cases for hue
            const hueRegion = Math.floor(scaledHue);
            // intermediate value for second largest component
            const X = chroma * (1 - Math.abs(scaledHue % 2 - 1));
            // constant to add to all colour components
            const m = lightness - chroma * 0.5;
            return Color.fromCXM(hueRegion, chroma, X, m, alpha);
        }
        /** create a color from HSI format */
        static fromHSI(hue, saturation, intensity, alpha = 1) {
            const scaledHue = hue * 6;
            // integer to isolate the 6 separate cases for hue
            const hueRegion = Math.floor(scaledHue);
            const Z = 1 - Math.abs(scaledHue % 2 - 1);
            const chroma = 3 * intensity * saturation / (1 + Z);
            // intermediate value for second largest component
            const X = chroma * Z;
            // constant to add to all colour components
            const m = intensity * (1 - saturation);
            return Color.fromCXM(hueRegion, chroma, X, m, alpha);
        }
        static fromCXM(hueRegion, chroma, X, m, alpha) {
            switch (hueRegion) {
                case 0: // red to yellow
                    return new Color(chroma + m, X + m, m, alpha);
                case 1: // yellow to green
                    return new Color(X + m, chroma + m, m, alpha);
                case 2: // green to cyan
                    return new Color(m, chroma + m, X + m, alpha);
                case 3: // cyan to blue
                    return new Color(m, X + m, chroma + m, alpha);
                case 4: // blue to magenta
                    return new Color(X + m, m, chroma + m, alpha);
                case 5: // magenta to red
                    return new Color(chroma + m, m, X + m, alpha);
                default:
                    return Color.BLACK;
            }
        }
    }
    exports.Color = Color;
    //#region defaults
    Color.ALICEBLUE = Color.fromHex("#F0F8FF");
    Color.ANTIQUEWHITE = Color.fromHex("#FAEBD7");
    Color.AQUA = Color.fromHex("#00FFFF");
    Color.AQUAMARINE = Color.fromHex("#7FFFD4");
    Color.AZURE = Color.fromHex("#F0FFFF");
    Color.BEIGE = Color.fromHex("#F5F5DC");
    Color.BISQUE = Color.fromHex("#FFE4C4");
    Color.BLACK = Color.fromHex("#000000");
    Color.BLANCHEDALMOND = Color.fromHex("#FFEBCD");
    Color.BLUE = Color.fromHex("#0000FF");
    Color.BLUEVIOLET = Color.fromHex("#8A2BE2");
    Color.BROWN = Color.fromHex("#A52A2A");
    Color.BURLYWOOD = Color.fromHex("#DEB887");
    Color.CADETBLUE = Color.fromHex("#5F9EA0");
    Color.CHARTREUSE = Color.fromHex("#7FFF00");
    Color.CHOCOLATE = Color.fromHex("#D2691E");
    Color.CORAL = Color.fromHex("#FF7F50");
    Color.CORNFLOWERBLUE = Color.fromHex("#6495ED");
    Color.CORNSILK = Color.fromHex("#FFF8DC");
    Color.CRIMSON = Color.fromHex("#DC143C");
    Color.CYAN = Color.fromHex("#00FFFF");
    Color.DARKBLUE = Color.fromHex("#00008B");
    Color.DARKCYAN = Color.fromHex("#008B8B");
    Color.DARKGOLDENROD = Color.fromHex("#B8860B");
    Color.DARKGRAY = Color.fromHex("#A9A9A9");
    Color.DARKGREY = Color.fromHex("#A9A9A9");
    Color.DARKGREEN = Color.fromHex("#006400");
    Color.DARKKHAKI = Color.fromHex("#BDB76B");
    Color.DARKMAGENTA = Color.fromHex("#8B008B");
    Color.DARKOLIVEGREEN = Color.fromHex("#556B2F");
    Color.DARKORANGE = Color.fromHex("#FF8C00");
    Color.DARKORCHID = Color.fromHex("#9932CC");
    Color.DARKRED = Color.fromHex("#8B0000");
    Color.DARKSALMON = Color.fromHex("#E9967A");
    Color.DARKSEAGREEN = Color.fromHex("#8FBC8F");
    Color.DARKSLATEBLUE = Color.fromHex("#483D8B");
    Color.DARKSLATEGRAY = Color.fromHex("#2F4F4F");
    Color.DARKSLATEGREY = Color.fromHex("#2F4F4F");
    Color.DARKTURQUOISE = Color.fromHex("#00CED1");
    Color.DARKVIOLET = Color.fromHex("#9400D3");
    Color.DEEPPINK = Color.fromHex("#FF1493");
    Color.DEEPSKYBLUE = Color.fromHex("#00BFFF");
    Color.DIMGRAY = Color.fromHex("#696969");
    Color.DIMGREY = Color.fromHex("#696969");
    Color.DODGERBLUE = Color.fromHex("#1E90FF");
    Color.FIREBRICK = Color.fromHex("#B22222");
    Color.FLORALWHITE = Color.fromHex("#FFFAF0");
    Color.FORESTGREEN = Color.fromHex("#228B22");
    Color.FUCHSIA = Color.fromHex("#FF00FF");
    Color.GAINSBORO = Color.fromHex("#DCDCDC");
    Color.GHOSTWHITE = Color.fromHex("#F8F8FF");
    Color.GOLD = Color.fromHex("#FFD700");
    Color.GOLDENROD = Color.fromHex("#DAA520");
    Color.GRAY = Color.fromHex("#808080");
    Color.GREY = Color.fromHex("#808080");
    Color.GREEN = Color.fromHex("#008000");
    Color.GREENYELLOW = Color.fromHex("#ADFF2F");
    Color.HONEYDEW = Color.fromHex("#F0FFF0");
    Color.HOTPINK = Color.fromHex("#FF69B4");
    Color.INDIANRED = Color.fromHex("#CD5C5C");
    Color.INDIGO = Color.fromHex("#4B0082");
    Color.IVORY = Color.fromHex("#FFFFF0");
    Color.KHAKI = Color.fromHex("#F0E68C");
    Color.LAVENDER = Color.fromHex("#E6E6FA");
    Color.LAVENDERBLUSH = Color.fromHex("#FFF0F5");
    Color.LAWNGREEN = Color.fromHex("#7CFC00");
    Color.LEMONCHIFFON = Color.fromHex("#FFFACD");
    Color.LIGHTBLUE = Color.fromHex("#ADD8E6");
    Color.LIGHTCORAL = Color.fromHex("#F08080");
    Color.LIGHTCYAN = Color.fromHex("#E0FFFF");
    Color.LIGHTGOLDENRODYELLOW = Color.fromHex("#FAFAD2");
    Color.LIGHTGRAY = Color.fromHex("#D3D3D3");
    Color.LIGHTGREY = Color.fromHex("#D3D3D3");
    Color.LIGHTGREEN = Color.fromHex("#90EE90");
    Color.LIGHTPINK = Color.fromHex("#FFB6C1");
    Color.LIGHTSALMON = Color.fromHex("#FFA07A");
    Color.LIGHTSEAGREEN = Color.fromHex("#20B2AA");
    Color.LIGHTSKYBLUE = Color.fromHex("#87CEFA");
    Color.LIGHTSLATEGRAY = Color.fromHex("#778899");
    Color.LIGHTSLATEGREY = Color.fromHex("#778899");
    Color.LIGHTSTEELBLUE = Color.fromHex("#B0C4DE");
    Color.LIGHTYELLOW = Color.fromHex("#FFFFE0");
    Color.LIME = Color.fromHex("#00FF00");
    Color.LIMEGREEN = Color.fromHex("#32CD32");
    Color.LINEN = Color.fromHex("#FAF0E6");
    Color.MAGENTA = Color.fromHex("#FF00FF");
    Color.MAROON = Color.fromHex("#800000");
    Color.MEDIUMAQUAMARINE = Color.fromHex("#66CDAA");
    Color.MEDIUMBLUE = Color.fromHex("#0000CD");
    Color.MEDIUMORCHID = Color.fromHex("#BA55D3");
    Color.MEDIUMPURPLE = Color.fromHex("#9370DB");
    Color.MEDIUMSEAGREEN = Color.fromHex("#3CB371");
    Color.MEDIUMSLATEBLUE = Color.fromHex("#7B68EE");
    Color.MEDIUMSPRINGGREEN = Color.fromHex("#00FA9A");
    Color.MEDIUMTURQUOISE = Color.fromHex("#48D1CC");
    Color.MEDIUMVIOLETRED = Color.fromHex("#C71585");
    Color.MIDNIGHTBLUE = Color.fromHex("#191970");
    Color.MINTCREAM = Color.fromHex("#F5FFFA");
    Color.MISTYROSE = Color.fromHex("#FFE4E1");
    Color.MOCCASIN = Color.fromHex("#FFE4B5");
    Color.NAVAJOWHITE = Color.fromHex("#FFDEAD");
    Color.NAVY = Color.fromHex("#000080");
    Color.OLDLACE = Color.fromHex("#FDF5E6");
    Color.OLIVE = Color.fromHex("#808000");
    Color.OLIVEDRAB = Color.fromHex("#6B8E23");
    Color.ORANGE = Color.fromHex("#FFA500");
    Color.ORANGERED = Color.fromHex("#FF4500");
    Color.ORCHID = Color.fromHex("#DA70D6");
    Color.PALEGOLDENROD = Color.fromHex("#EEE8AA");
    Color.PALEGREEN = Color.fromHex("#98FB98");
    Color.PALETURQUOISE = Color.fromHex("#AFEEEE");
    Color.PALEVIOLETRED = Color.fromHex("#DB7093");
    Color.PAPAYAWHIP = Color.fromHex("#FFEFD5");
    Color.PEACHPUFF = Color.fromHex("#FFDAB9");
    Color.PERU = Color.fromHex("#CD853F");
    Color.PINK = Color.fromHex("#FFC0CB");
    Color.PLUM = Color.fromHex("#DDA0DD");
    Color.POWDERBLUE = Color.fromHex("#B0E0E6");
    Color.PURPLE = Color.fromHex("#800080");
    Color.REBECCAPURPLE = Color.fromHex("#663399");
    Color.RED = Color.fromHex("#FF0000");
    Color.ROSYBROWN = Color.fromHex("#BC8F8F");
    Color.ROYALBLUE = Color.fromHex("#4169E1");
    Color.SADDLEBROWN = Color.fromHex("#8B4513");
    Color.SALMON = Color.fromHex("#FA8072");
    Color.SANDYBROWN = Color.fromHex("#F4A460");
    Color.SEAGREEN = Color.fromHex("#2E8B57");
    Color.SEASHELL = Color.fromHex("#FFF5EE");
    Color.SIENNA = Color.fromHex("#A0522D");
    Color.SILVER = Color.fromHex("#C0C0C0");
    Color.SKYBLUE = Color.fromHex("#87CEEB");
    Color.SLATEBLUE = Color.fromHex("#6A5ACD");
    Color.SLATEGRAY = Color.fromHex("#708090");
    Color.SLATEGREY = Color.fromHex("#708090");
    Color.SNOW = Color.fromHex("#FFFAFA");
    Color.SPRINGGREEN = Color.fromHex("#00FF7F");
    Color.STEELBLUE = Color.fromHex("#4682B4");
    Color.TAN = Color.fromHex("#D2B48C");
    Color.TEAL = Color.fromHex("#008080");
    Color.THISTLE = Color.fromHex("#D8BFD8");
    /** the available color spaces supported by the library */
    var ColorSpace;
    (function (ColorSpace) {
        ColorSpace[ColorSpace["RGB"] = 0] = "RGB";
        ColorSpace[ColorSpace["HSV"] = 1] = "HSV";
        ColorSpace[ColorSpace["HSL"] = 2] = "HSL";
        ColorSpace[ColorSpace["HSI"] = 3] = "HSI";
    })(ColorSpace = exports.ColorSpace || (exports.ColorSpace = {}));
});

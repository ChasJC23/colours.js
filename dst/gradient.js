var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./color", "./mathExt"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JoinedGradient = exports.DirectGradient = exports.Interpolation = void 0;
    const color_1 = require("./color");
    const mathExt = __importStar(require("./mathExt"));
    /** the available interpolation methods supported by the library */
    var Interpolation;
    (function (Interpolation) {
        Interpolation[Interpolation["linear"] = 0] = "linear";
        Interpolation[Interpolation["inc_quadratic"] = 1] = "inc_quadratic";
        Interpolation[Interpolation["dec_quadratic"] = 2] = "dec_quadratic";
        Interpolation[Interpolation["cubic"] = 3] = "cubic";
    })(Interpolation = exports.Interpolation || (exports.Interpolation = {}));
    class DirectGradient extends Object {
        /** represents a smooth gradient between two colors */
        constructor(startColor, endColor, space = color_1.ColorSpace.RGB, interpolation = Interpolation.linear, longRoute = false, cycles = 0) {
            super();
            this.colorSpace = space;
            this.interpMethod = interpolation;
            let { fromColor, toColor } = getCastingFtns(space);
            let { interpFtn, cyclicInterpFtn } = getInterpFtns(interpolation, longRoute);
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
        getAt(t) {
            return this.toColor(0b100 & this.cyclicArg ? this.cyclicInterpFtn(t, this.s1, this.e1, this.cycles) : this.interpFtn(t, this.s1, this.e1), 0b010 & this.cyclicArg ? this.cyclicInterpFtn(t, this.s2, this.e2, this.cycles) : this.interpFtn(t, this.s2, this.e2), 0b001 & this.cyclicArg ? this.cyclicInterpFtn(t, this.s3, this.e3, this.cycles) : this.interpFtn(t, this.s3, this.e3));
        }
        get startColor() {
            return this.toColor(this.s1, this.s2, this.s3);
        }
        get endColor() {
            return this.toColor(this.e1, this.e2, this.e3);
        }
        set startColor(c) {
            [this.s1, this.s2, this.s3] = this.fromColor(c);
        }
        set endColor(c) {
            [this.e1, this.e2, this.e3] = this.fromColor(c);
        }
        get interpolation() {
            return this.interpMethod;
        }
        get space() {
            return this.colorSpace;
        }
        set interpolation(interpolation) {
            this.interpMethod = interpolation;
            let { interpFtn, cyclicInterpFtn } = getInterpFtns(interpolation, this._longRoute);
            this.interpFtn = interpFtn;
            this.cyclicInterpFtn = cyclicInterpFtn;
        }
        set space(space) {
            this.colorSpace = space;
            let s = this.startColor, e = this.endColor;
            let { fromColor, toColor } = getCastingFtns(space);
            this.fromColor = fromColor;
            this.toColor = toColor;
            this.cyclicArg = getCyclicArg(space);
            this.startColor = s, this.endColor = e;
        }
        get longRoute() {
            return this._longRoute;
        }
        set longRoute(longRoute) {
            this._longRoute = longRoute;
            let { interpFtn, cyclicInterpFtn } = getInterpFtns(this.interpMethod, longRoute);
            this.interpFtn = interpFtn;
            this.cyclicInterpFtn = cyclicInterpFtn;
        }
        toString() {
            return `DirectGradient(${this.startColor}, ${this.endColor})`;
        }
    }
    exports.DirectGradient = DirectGradient;
    class JoinedGradient extends Object {
        /** represents a gradient between many colors, travelling an abstract route through color space. */
        constructor(startColor, ...segments) {
            super();
            this.colors = [startColor];
            this.colorSpaces = [];
            this.interpMethods = [];
            this.longRoutes = [];
            this.cycles = [];
            let lengths = [];
            for (const segment of segments) {
                this.colors.push(segment.color);
                this.colorSpaces.push(segment.space || color_1.ColorSpace.RGB);
                this.interpMethods.push(segment.interpolation || Interpolation.linear);
                this.longRoutes.push(segment.longRoute || false);
                this.cycles.push(segment.cycles || 0);
                lengths.push(segment.length || 1);
            }
            this.factor = mathExt.sum(...lengths);
            this.lengths = mathExt.normalize_1D(lengths);
        }
        getAt(t) {
            let lt = t;
            let i = 0;
            for (; lt > this.lengths[i]; i++)
                lt -= this.lengths[i];
            lt /= this.lengths[i];
            let g = new DirectGradient(this.colors[i], this.colors[i + 1], this.colorSpaces[i], this.interpMethods[i], this.longRoutes[i], this.cycles[i]);
            return g.getAt(lt);
        }
        /** get the contained gradient at index i */
        getGradient(i) {
            return new DirectGradient(this.colors[i], this.colors[i + 1], this.colorSpaces[i], this.interpMethods[i], this.longRoutes[i], this.cycles[i]);
        }
        /** set the contained gradient at index i */
        setGradient(i, gradient) {
            this.colors[i] = gradient.startColor;
            this.colors[i + 1] = gradient.endColor;
            this.colorSpaces[i] = gradient.space;
            this.interpMethods[i] = gradient.interpolation;
            this.longRoutes[i] = gradient.longRoute;
            this.cycles[i] = gradient.cycles;
        }
        /** get the length of the contained gradient at index i */
        getGradientLength(i) {
            return this.lengths[i] * this.factor;
        }
        /** set the length of the contained gradient at index i */
        setGradientLength(i, length) {
            let originalLengths = this.lengths;
            originalLengths.forEach((v, i) => originalLengths[i] = v * this.factor);
            originalLengths[i] = length;
            this.factor = mathExt.sum(...originalLengths);
            this.lengths = mathExt.normalize_1D(originalLengths);
        }
        toString() {
            return `JoinedGradient(${this.colors[0], this.colors[this.colors.length - 1]})`;
        }
    }
    exports.JoinedGradient = JoinedGradient;
    /** collects the appropriate casting functions for a given color space */
    function getCastingFtns(space) {
        let fromColor;
        let toColor;
        switch (space) {
            case color_1.ColorSpace.RGB:
                fromColor = (c) => c.toRGB();
                toColor = (r, g, b) => new color_1.Color(r, g, b);
                break;
            case color_1.ColorSpace.HSV:
                fromColor = (c) => c.toHSV();
                toColor = (h, s, v) => color_1.Color.fromHSV(h, s, v);
                break;
            case color_1.ColorSpace.HSL:
                fromColor = (c) => c.toHSL();
                toColor = (h, s, l) => color_1.Color.fromHSL(h, s, l);
                break;
            case color_1.ColorSpace.HSI:
                fromColor = (c) => c.toHSI();
                toColor = (h, s, i) => color_1.Color.fromHSI(h, s, i);
                break;
            default:
                throw new Error("That color space is not yet supported within in this function.");
        }
        return { toColor, fromColor };
    }
    /** collects the appropriate interpolation functions for a given interpolation method */
    function getInterpFtns(interpolation, longRoute = false) {
        let interpFtn;
        let cyclicInterpFtn;
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
    /** returns a number which indicates which components of a given color system are cyclical */
    function getCyclicArg(space) {
        return space == color_1.ColorSpace.RGB ? 0 : 0b100;
    }
});

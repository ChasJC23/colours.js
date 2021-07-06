(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.normalize_1D = exports.cyclicCubicInterp_deriv_long = exports.cyclicCubicInterp_deriv_short = exports.cyclicQerp_1_long = exports.cyclicQerp_1_short = exports.cyclicQerp_0_long = exports.cyclicQerp_0_short = exports.cyclicLerp_long = exports.cyclicLerp_short = exports.cubicInterp_pt = exports.cubicInterp_deriv = exports.qerp_1 = exports.qerp_0 = exports.lerp = exports.sum = exports.avg = exports.mid = void 0;
    /** calculates the mid() of a set of values */
    function mid(...values) {
        return (Math.max(...values) + Math.min(...values)) / 2;
    }
    exports.mid = mid;
    /** calculates the means of a set of values */
    function avg(...values) {
        return sum(...values) / values.length;
    }
    exports.avg = avg;
    /** calculates the sum of a set of values */
    function sum(...values) {
        return values.reduce((a, b) => a + b);
    }
    exports.sum = sum;
    /** linear interpolation */
    function lerp(t, a, b) {
        return (b - a) * t + a;
    }
    exports.lerp = lerp;
    /** quadratic interpolation which starts at its turning point */
    function qerp_0(t, a, b) {
        return (b - a) * t * t + a;
    }
    exports.qerp_0 = qerp_0;
    /** quadratic interpolation which ends at its turning point */
    function qerp_1(t, a, b) {
        return (b - a) * (2 - t) * t + a;
    }
    exports.qerp_1 = qerp_1;
    /** cubic interpolation using derivatives */
    function cubicInterp_deriv(t, a, b, aprime = 0, bprime = 0) {
        return (2 * a - 2 * b + aprime + bprime) * t * t * t + (3 * b - 3 * a - 2 * aprime - bprime) * t * t + aprime * t + a;
    }
    exports.cubicInterp_deriv = cubicInterp_deriv;
    /** cubic interpolation using points */
    function cubicInterp_pt(t, p0, p1, p2, p3) {
        return (-0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3) * t * t * t + (p0 - 2.5 * p1 + 2 * p2 - 0.5 * p3) * t * t + (0.5 * p2 - 0.5 * p0) * t + p1;
    }
    exports.cubicInterp_pt = cubicInterp_pt;
    /** cyclical linear interpolation using the shorter of the two immediate paths */
    function cyclicLerp_short(t, a, b, cycles = 0) {
        const diff = b - a;
        if (diff > 0.5) {
            return ((diff - 1 - cycles) * t + a + 1 + cycles) % 1;
        }
        else if (diff < -0.5) {
            return ((diff + 1 + cycles) * t + a) % 1;
        }
        else if (diff > 0) {
            return ((diff + cycles) * t + a) % 1;
        }
        else {
            return ((diff - cycles) * t + a + cycles) % 1;
        }
    }
    exports.cyclicLerp_short = cyclicLerp_short;
    /** cyclical linear interpolation using the longer of the two immediate paths */
    function cyclicLerp_long(t, a, b, cycles = 0) {
        const diff = b - a;
        if (diff > 0.5) {
            return ((diff + cycles) * t + a) % 1;
        }
        else if (diff < -0.5) {
            return ((diff - cycles) * t + a + cycles) % 1;
        }
        else if (diff > 0) {
            return ((diff - 1 - cycles) * t + a + 1 + cycles) % 1;
        }
        else {
            return ((diff + 1 + cycles) * t + a) % 1;
        }
    }
    exports.cyclicLerp_long = cyclicLerp_long;
    /** cyclical quadratic interpolation which starts at its turning point using the shorter of the two immediate paths */
    function cyclicQerp_0_short(t, a, b, cycles = 0) {
        const diff = b - a;
        if (diff > 0.5) {
            return ((diff - 1 - cycles) * t * t + a + 1 + cycles) % 1;
        }
        else if (diff < -0.5) {
            return ((diff + 1 + cycles) * t * t + a) % 1;
        }
        else if (diff > 0) {
            return ((diff + cycles) * t * t + a) % 1;
        }
        else {
            return ((diff - cycles) * t * t + a + cycles) % 1;
        }
    }
    exports.cyclicQerp_0_short = cyclicQerp_0_short;
    /** cyclical quadratic interpolation which starts at its turning point using the longer of the two immediate paths */
    function cyclicQerp_0_long(t, a, b, cycles = 0) {
        const diff = b - a;
        if (diff > 0.5) {
            return ((diff + cycles) * t * t + a) % 1;
        }
        else if (diff < -0.5) {
            return ((diff - cycles) * t * t + a + cycles) % 1;
        }
        else if (diff > 0) {
            return ((diff - 1 - cycles) * t * t + a + 1 + cycles) % 1;
        }
        else {
            return ((diff + 1 + cycles) * t * t + a) % 1;
        }
    }
    exports.cyclicQerp_0_long = cyclicQerp_0_long;
    /** cyclical quadratic interpolation which ends at its turning point using the shorter of the two immediate paths */
    function cyclicQerp_1_short(t, a, b, cycles = 0) {
        const diff = b - a;
        if (diff > 0.5) {
            return ((diff - 1 - cycles) * (2 - t) * t + a + 1 + cycles) % 1;
        }
        else if (diff < -0.5) {
            return ((diff + 1 + cycles) * (2 - t) * t + a) % 1;
        }
        else if (diff > 0) {
            return ((diff + cycles) * (2 - t) * t + a) % 1;
        }
        else {
            return ((diff - cycles) * (2 - t) * t + a + cycles) % 1;
        }
    }
    exports.cyclicQerp_1_short = cyclicQerp_1_short;
    /** cyclical quadratic interpolation which ends at its turning point using the longer of the two immediate paths */
    function cyclicQerp_1_long(t, a, b, cycles = 0) {
        const diff = b - a;
        if (diff > 0.5) {
            return ((diff + cycles) * (2 - t) * t + a) % 1;
        }
        else if (diff < -0.5) {
            return ((diff - cycles) * (2 - t) * t + a + cycles) % 1;
        }
        else if (diff > 0) {
            return ((diff - 1 - cycles) * (2 - t) * t + a + 1 + cycles) % 1;
        }
        else {
            return ((diff + 1 + cycles) * (2 - t) * t + a) % 1;
        }
    }
    exports.cyclicQerp_1_long = cyclicQerp_1_long;
    /** cyclical cubic interpolation using derivatives using the shorter of the two immediate paths */
    function cyclicCubicInterp_deriv_short(t, a, b, aprime = 0, bprime = 0, cycles = 0) {
        const diff = b - a;
        if (diff > 0.5) {
            return ((-2 * (diff - 1 - cycles) + aprime + bprime) * t * t * t + (3 * (diff - 1 - cycles) - 2 * aprime - bprime) * t * t + aprime * t + a + 1 + cycles) % 1;
        }
        else if (diff < -0.5) {
            return ((-2 * (diff + 1 + cycles) + aprime + bprime) * t * t * t + (3 * (diff + 1 + cycles) - 2 * aprime - bprime) * t * t + aprime * t + a) % 1;
        }
        else if (diff > 0) {
            return ((-2 * (diff + cycles) + aprime + bprime) * t * t * t + (3 * (diff + cycles) - 2 * aprime - bprime) * t * t + aprime * t + a) % 1;
        }
        else {
            return ((-2 * (diff - cycles) + aprime + bprime) * t * t * t + (3 * (diff - cycles) - 2 * aprime - bprime) * t * t + aprime * t + a + cycles) % 1;
        }
    }
    exports.cyclicCubicInterp_deriv_short = cyclicCubicInterp_deriv_short;
    /** cyclical cubic interpolation using derivatives using the longer of the two immediate paths */
    function cyclicCubicInterp_deriv_long(t, a, b, aprime = 0, bprime = 0, cycles = 0) {
        const diff = b - a;
        if (diff > 0.5) {
            return ((-2 * (diff + cycles) + aprime + bprime) * t * t * t + (3 * (diff + cycles) - 2 * aprime - bprime) * t * t + aprime * t + a) % 1;
        }
        else if (diff < -0.5) {
            return ((-2 * (diff - cycles) + aprime + bprime) * t * t * t + (3 * (diff - cycles) - 2 * aprime - bprime) * t * t + aprime * t + a + cycles) % 1;
        }
        else if (diff > 0) {
            return ((-2 * (diff - 1 - cycles) + aprime + bprime) * t * t * t + (3 * (diff - 1 - cycles) - 2 * aprime - bprime) * t * t + aprime * t + a + 1 + cycles) % 1;
        }
        else {
            return ((-2 * (diff + 1 + cycles) + aprime + bprime) * t * t * t + (3 * (diff + 1 + cycles) - 2 * aprime - bprime) * t * t + aprime * t + a) % 1;
        }
    }
    exports.cyclicCubicInterp_deriv_long = cyclicCubicInterp_deriv_long;
    /** ensures the sum of an array equals 1 */
    function normalize_1D(nums) {
        let total = sum(...nums);
        nums.forEach((v, i) => nums[i] = v / total);
        return nums;
    }
    exports.normalize_1D = normalize_1D;
});

/** calculates the mid() of a set of values */
export function mid(...values: number[]): number {
    return (Math.max(...values) + Math.min(...values)) / 2;
}

/** calculates the means of a set of values */
export function avg(...values: number[]): number {
    return sum(...values) / values.length;
}

/** calculates the sum of a set of values */
export function sum(...values: number[]): number {
    return values.reduce((a, b) => a + b);
}

/** linear interpolation */
export function lerp(t: number, a: number, b: number): number {
    return (b - a) * t + a;
}

/** quadratic interpolation which starts at its turning point */
export function qerp_0(t: number, a: number, b: number): number {
    return (b - a) * t * t + a;
}

/** quadratic interpolation which ends at its turning point */
export function qerp_1(t: number, a: number, b: number): number {
    return (b - a) * (2 - t) * t + a;
}

/** cubic interpolation using derivatives */
export function cubicInterp_deriv(t: number, a: number, b: number, aprime = 0, bprime = 0): number {
    return (2 * a - 2 * b + aprime + bprime) * t * t * t + (3 * b - 3 * a - 2 * aprime - bprime) * t * t + aprime * t + a;
}

/** cubic interpolation using points */
export function cubicInterp_pt(t: number, p0: number, p1: number, p2: number, p3: number): number {
    return (-0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3) * t * t * t + (p0 - 2.5 * p1 + 2 * p2 - 0.5 * p3) * t * t + (0.5 * p2 - 0.5 * p0) * t + p1;
}

/** cyclical linear interpolation using the shorter of the two immediate paths */
export function cyclicLerp_short(t: number, a: number, b: number, cycles = 0): number {
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

/** cyclical linear interpolation using the longer of the two immediate paths */
export function cyclicLerp_long(t: number, a: number, b: number, cycles = 0): number {
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

/** cyclical quadratic interpolation which starts at its turning point using the shorter of the two immediate paths */
export function cyclicQerp_0_short(t: number, a: number, b: number, cycles = 0): number {
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

/** cyclical quadratic interpolation which starts at its turning point using the longer of the two immediate paths */
export function cyclicQerp_0_long(t: number, a: number, b: number, cycles = 0): number {
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

/** cyclical quadratic interpolation which ends at its turning point using the shorter of the two immediate paths */
export function cyclicQerp_1_short(t: number, a: number, b: number, cycles = 0): number {
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

/** cyclical quadratic interpolation which ends at its turning point using the longer of the two immediate paths */
export function cyclicQerp_1_long(t: number, a: number, b: number, cycles = 0): number {
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

/** cyclical cubic interpolation using derivatives using the shorter of the two immediate paths */
export function cyclicCubicInterp_deriv_short(t: number, a: number, b: number, aprime = 0, bprime = 0, cycles = 0): number {
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

/** cyclical cubic interpolation using derivatives using the longer of the two immediate paths */
export function cyclicCubicInterp_deriv_long(t: number, a: number, b: number, aprime = 0, bprime = 0, cycles = 0): number {
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

/** ensures the sum of an array equals 1 */
export function normalize_1D(nums: number[]) {
    let total = sum(...nums);
    nums.forEach((v, i) => nums[i] = v / total);
    return nums;
}
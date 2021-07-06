/** calculates the mid() of a set of values */
export declare function mid(...values: number[]): number;
/** calculates the means of a set of values */
export declare function avg(...values: number[]): number;
/** calculates the sum of a set of values */
export declare function sum(...values: number[]): number;
/** linear interpolation */
export declare function lerp(t: number, a: number, b: number): number;
/** quadratic interpolation which starts at its turning point */
export declare function qerp_0(t: number, a: number, b: number): number;
/** quadratic interpolation which ends at its turning point */
export declare function qerp_1(t: number, a: number, b: number): number;
/** cubic interpolation using derivatives */
export declare function cubicInterp_deriv(t: number, a: number, b: number, aprime?: number, bprime?: number): number;
/** cubic interpolation using points */
export declare function cubicInterp_pt(t: number, p0: number, p1: number, p2: number, p3: number): number;
/** cyclical linear interpolation using the shorter of the two immediate paths */
export declare function cyclicLerp_short(t: number, a: number, b: number, cycles?: number): number;
/** cyclical linear interpolation using the longer of the two immediate paths */
export declare function cyclicLerp_long(t: number, a: number, b: number, cycles?: number): number;
/** cyclical quadratic interpolation which starts at its turning point using the shorter of the two immediate paths */
export declare function cyclicQerp_0_short(t: number, a: number, b: number, cycles?: number): number;
/** cyclical quadratic interpolation which starts at its turning point using the longer of the two immediate paths */
export declare function cyclicQerp_0_long(t: number, a: number, b: number, cycles?: number): number;
/** cyclical quadratic interpolation which ends at its turning point using the shorter of the two immediate paths */
export declare function cyclicQerp_1_short(t: number, a: number, b: number, cycles?: number): number;
/** cyclical quadratic interpolation which ends at its turning point using the longer of the two immediate paths */
export declare function cyclicQerp_1_long(t: number, a: number, b: number, cycles?: number): number;
/** cyclical cubic interpolation using derivatives using the shorter of the two immediate paths */
export declare function cyclicCubicInterp_deriv_short(t: number, a: number, b: number, aprime?: number, bprime?: number, cycles?: number): number;
/** cyclical cubic interpolation using derivatives using the longer of the two immediate paths */
export declare function cyclicCubicInterp_deriv_long(t: number, a: number, b: number, aprime?: number, bprime?: number, cycles?: number): number;
/** ensures the sum of an array equals 1 */
export declare function normalize_1D(nums: number[]): number[];
//# sourceMappingURL=mathExt.d.ts.map
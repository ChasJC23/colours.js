import { Color } from "./color";
import { Gradient } from "./gradient";
export declare function generateStyle(color: Color, isBg?: boolean): string;
export declare function uniform(element: HTMLElement, color: Color, isBg?: boolean): void;
export declare function cyclicUniform(element: HTMLElement, segmentLength: number, isBg?: boolean, ...colors: Color[]): void;
export declare function gradient(element: HTMLElement, gradient: Gradient, isBg?: boolean): void;
export declare function cyclicGradient(element: HTMLElement, segmentLength: number, isBg?: boolean, ...gradients: Gradient[]): void;
//# sourceMappingURL=web.d.ts.map
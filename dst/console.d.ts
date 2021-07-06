import { Color } from "./color";
import { Gradient } from "./gradient";
/** generates the token used in a console message to color the background */
export declare function colorBGToken(color: Color): string;
/** generates the token used in a console message to color the message text */
export declare function colorFGToken(color: Color): string;
/** constant for resetting the console color */
export declare const resetToken = "\u001B[0m";
/** color a given string of text a given color */
export declare function uniform(text: string, color: Color, isBg?: boolean): string;
/** color a given string a given sequence of colors in a cyclical order */
export declare function cyclicUniform(text: string, segmentLength: number, isBg?: boolean, ...colors: Color[]): string;
/** color a given string according to a given gradient */
export declare function gradient(text: string, gradient: Gradient, isBg?: boolean): string;
/** color a given string a given sequence of gradients in a cyclical order */
export declare function cyclicGradient(text: string, segmentLength: number, isBg?: boolean, ...gradients: Gradient[]): string;
//# sourceMappingURL=console.d.ts.map
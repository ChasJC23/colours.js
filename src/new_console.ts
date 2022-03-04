import { Colour, Gradient } from ".";
import { gradient, uniform } from "./console";
import {inspect} from "util";
import { DirectGradient, JoinedGradient } from "./gradient";

const colourSymbol = Symbol("colourSymbol")

type Coloured<T> = T & {[colourSymbol]: Colour};
type GradientColoured<T> = T & {[colourSymbol]: Gradient};

interface ColouredConsole extends Console {
    log(...data: any[]): void;
}

export const colouredConsole: ColouredConsole = {
    ...console,
    log(...data: any[]): void {
        console.log(...
            data.map(element => {
                let colour_data = element[colourSymbol];
                delete element[colourSymbol];
                element = element.valueOf ? element.valueOf() : element;
                let strrep: string = typeof element == "object" ? inspect(element) : element.toString();
                element[colourSymbol] = colour_data;
                if (colour_data instanceof Colour) {
                    return uniform(strrep, colour_data);
                }
                else if (colour_data instanceof DirectGradient || colour_data instanceof JoinedGradient) {
                    return gradient(strrep, colour_data);
                }
                else {
                    return strrep;
                }
            })
        );
    }
};

export function apply<T>(item: T, colour: Colour): Coloured<T>
export function apply<T>(item: T, colour: Gradient): GradientColoured<T>
export function apply<T>(item: T, colour: Colour | Gradient) {
    let obj = new Object(item);
    return {...obj, [colourSymbol]: colour};
}

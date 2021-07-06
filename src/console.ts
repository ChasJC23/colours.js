import { Color } from "./color";
import { Gradient } from "./gradient";

/** generates the token used in a console message to color the background */
export function colorBGToken(color: Color) {
    return `\u001B[48;2;${color.r_8b};${color.g_8b};${color.b_8b}m`;
}

/** generates the token used in a console message to color the message text */
export function colorFGToken(color: Color) {
    return `\u001B[38;2;${color.r_8b};${color.g_8b};${color.b_8b}m`;
}

/** constant for resetting the console color */
export const resetToken = "\x1b[0m";

/** calculates the number of characters within the given string that may be colored */
function getColorableCount(text: string) : number {

    let colorableCount = 0;

    for (let i = 0; i < text.length; i++) {
        if (text[i] == '\u001B') {
            do { i++; } while (text[i] != 'm');
            i++;
        }
        colorableCount++;
    }

    return colorableCount;
}

/** color a given string of text a given color */
export function uniform(text: string, color: Color, isBg = false) : string {
    text = text.replace(resetToken, "");
    return (isBg ? colorBGToken(color) : colorFGToken(color)) + text + resetToken;
}

/** color a given string a given sequence of colors in a cyclical order */
export function cyclicUniform(text: string, segmentLength: number, isBg = false, ... colors: Color[]) : string {

    text = text.replace(resetToken, "");
    let result = "";
    let c = 0;

    let getToken = isBg ? colorBGToken : colorFGToken;

    for (let i = 0; i < text.length; i++) {

        // skip characters used for recoloring
        if (text[i] == '\u001B') {
            do {
                result += text[i];
                i++;
            } while (text[i] != 'm');
            result += text[i];
            i++;
        }

        result += getToken(colors[Math.floor(c / segmentLength) % colors.length]) + text[i];

        c++;
    }
    return result + resetToken;
}

/** color a given string according to a given gradient */
export function gradient(text: string, gradient: Gradient, isBg = false) : string {

    text = text.replace(resetToken, "");

    let colorableCount = getColorableCount(text);

    let result = "";
    let t = 0;

    // we walk through the message, skipping any already existing color modifiers
    for (let i = 0; i < text.length; i++) {

        if (text[i] == '\u001B') {
            do {
                result += text[i];
                i++;
            } while (text[i] != 'm');
            result += text[i];
            i++;
        }

        // generate the color using the functions we got in the arguments
        const color = gradient.getAt(t / colorableCount);

        // add the current character colored with the color we created earlier
        result += isBg ? colorBGToken(color) : colorFGToken(color);
        result += text[i];

        t++;
    }

    return result + resetToken;
}

/** color a given string a given sequence of gradients in a cyclical order */
export function cyclicGradient(text: string, segmentLength: number, isBg = false, ... gradients: Gradient[]) {
    
    text = text.replace(resetToken, "");

    let result = "";
    let c = 0;

    let getToken = isBg ? colorBGToken : colorFGToken;

    for (let i = 0; i < text.length; i++) {

        // skip characters used for recoloring
        if (text[i] == '\u001B') {
            do {
                result += text[i];
                i++;
            } while (text[i] != 'm');
            result += text[i];
            i++;
        }

        let prop = c / segmentLength;
        let index = Math.floor(prop) % gradients.length;
        let t = prop % 1;

        result += getToken(gradients[index].getAt(t)) + text[i];
        
        c++;
    }

    return result + resetToken;
}
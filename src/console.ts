import { Colour } from "./colour";
import { Gradient } from "./gradient";

/** generates the token used in a console message to colour the background */
export function colourBGToken(colour: Colour) {
    return `\u001B[48;2;${colour.r_8b};${colour.g_8b};${colour.b_8b}m`;
}

/** generates the token used in a console message to colour the message text */
export function colourFGToken(colour: Colour) {
    return `\u001B[38;2;${colour.r_8b};${colour.g_8b};${colour.b_8b}m`;
}

/** constant for resetting the console colour */
export const resetToken = "\x1b[0m";

/** calculates the number of characters within the given string that may be coloured */
function getColourableCount(text: string): number {

    let colourableCount = 0;

    for (let i = 0; i < text.length; i++) {
        if (text[i] == '\u001B') {
            do { i++; } while (text[i] != 'm');
            i++;
        }
        colourableCount++;
    }

    return colourableCount;
}

/** colour a given string of text a given colour */
export function uniform(text: string, colour: Colour, isBg = false): string {
    text = text.replace(resetToken, "");
    return (isBg ? colourBGToken(colour) : colourFGToken(colour)) + text + resetToken;
}

/** colour a given string a given sequence of colours in a cyclical order */
export function cyclicUniform(text: string, segmentLength: number, isBg = false, ... colours: Colour[]): string {

    text = text.replace(resetToken, "");
    let result = "";
    let c = 0;

    let getToken = isBg ? colourBGToken : colourFGToken;

    for (let i = 0; i < text.length; i++) {

        // skip characters used for recolouring
        if (text[i] == '\u001B') {
            do {
                result += text[i];
                i++;
            } while (text[i] != 'm');
            result += text[i];
            i++;
        }

        result += getToken(colours[Math.floor(c / segmentLength) % colours.length]) + text[i];

        c++;
    }
    return result + resetToken;
}

/** colour a given string according to a given gradient */
export function gradient(text: string, gradient: Gradient, isBg = false): string {

    text = text.replace(resetToken, "");

    let colourableCount = getColourableCount(text);

    let result = "";
    let t = 0;

    // we walk through the message, skipping any already existing colour modifiers
    for (let i = 0; i < text.length; i++) {

        if (text[i] == '\u001B') {
            do {
                result += text[i];
                i++;
            } while (text[i] != 'm');
            result += text[i];
            i++;
        }

        // generate the colour using the functions we got in the arguments
        const colour = gradient.getAt(t / colourableCount);

        // add the current character coloured with the colour we created earlier
        result += isBg ? colourBGToken(colour) : colourFGToken(colour);
        result += text[i];

        t++;
    }

    return result + resetToken;
}

/** colour a given string a given sequence of gradients in a cyclical order */
export function cyclicGradient(text: string, segmentLength: number, isBg = false, ... gradients: Gradient[]) {
    
    text = text.replace(resetToken, "");

    let result = "";
    let c = 0;

    let getToken = isBg ? colourBGToken : colourFGToken;

    for (let i = 0; i < text.length; i++) {

        // skip characters used for recolouring
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
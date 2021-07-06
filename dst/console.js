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
    exports.cyclicGradient = exports.gradient = exports.cyclicUniform = exports.uniform = exports.resetToken = exports.colorFGToken = exports.colorBGToken = void 0;
    /** generates the token used in a console message to color the background */
    function colorBGToken(color) {
        return `\u001B[48;2;${color.r_8b};${color.g_8b};${color.b_8b}m`;
    }
    exports.colorBGToken = colorBGToken;
    /** generates the token used in a console message to color the message text */
    function colorFGToken(color) {
        return `\u001B[38;2;${color.r_8b};${color.g_8b};${color.b_8b}m`;
    }
    exports.colorFGToken = colorFGToken;
    /** constant for resetting the console color */
    exports.resetToken = "\x1b[0m";
    /** calculates the number of characters within the given string that may be colored */
    function getColorableCount(text) {
        let colorableCount = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i] == '\u001B') {
                do {
                    i++;
                } while (text[i] != 'm');
                i++;
            }
            colorableCount++;
        }
        return colorableCount;
    }
    /** color a given string of text a given color */
    function uniform(text, color, isBg = false) {
        text = text.replace(exports.resetToken, "");
        return (isBg ? colorBGToken(color) : colorFGToken(color)) + text + exports.resetToken;
    }
    exports.uniform = uniform;
    /** color a given string a given sequence of colors in a cyclical order */
    function cyclicUniform(text, segmentLength, isBg = false, ...colors) {
        text = text.replace(exports.resetToken, "");
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
        return result + exports.resetToken;
    }
    exports.cyclicUniform = cyclicUniform;
    /** color a given string according to a given gradient */
    function gradient(text, gradient, isBg = false) {
        text = text.replace(exports.resetToken, "");
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
        return result + exports.resetToken;
    }
    exports.gradient = gradient;
    /** color a given string a given sequence of gradients in a cyclical order */
    function cyclicGradient(text, segmentLength, isBg = false, ...gradients) {
        text = text.replace(exports.resetToken, "");
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
        return result + exports.resetToken;
    }
    exports.cyclicGradient = cyclicGradient;
});

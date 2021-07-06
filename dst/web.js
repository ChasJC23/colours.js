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
    exports.cyclicGradient = exports.gradient = exports.cyclicUniform = exports.uniform = exports.generateStyle = void 0;
    function generateStyle(color, isBg = false) {
        let result = isBg ? "background-color: " : "color: ";
        return result + `rgba(${color.r_8b}, ${color.g_8b}, ${color.b_8b}, ${color.alpha});`;
    }
    exports.generateStyle = generateStyle;
    function uniform(element, color, isBg = false) {
        if (element.children.length != 0)
            throw new Error("Element must be empty");
        let coloringElement = document.createElement("span");
        coloringElement.style.cssText = generateStyle(color, isBg);
        coloringElement.innerText = element.innerText;
        element.innerText = "";
        element.appendChild(coloringElement);
    }
    exports.uniform = uniform;
    function cyclicUniform(element, segmentLength, isBg = false, ...colors) {
        if (element.children.length != 0)
            throw new Error("Element must be empty");
        let text = element.innerText;
        element.innerText = "";
        for (let i = 0; i < text.length; i++) {
            let coloringElement = document.createElement("span");
            coloringElement.style.cssText = generateStyle(colors[Math.floor(i / segmentLength) % colors.length], isBg);
            coloringElement.innerText = text[i];
            element.appendChild(coloringElement);
        }
    }
    exports.cyclicUniform = cyclicUniform;
    function gradient(element, gradient, isBg = false) {
        if (element.children.length != 0)
            throw new Error("Element must be empty");
        let text = element.innerText;
        element.innerText = "";
        for (let i = 0; i < text.length; i++) {
            const color = gradient.getAt(i / text.length);
            let coloringElement = document.createElement("span");
            coloringElement.style.cssText = generateStyle(color, isBg);
            coloringElement.innerText = text[i];
            element.appendChild(coloringElement);
        }
    }
    exports.gradient = gradient;
    function cyclicGradient(element, segmentLength, isBg = true, ...gradients) {
        if (element.children.length != 0)
            throw new Error("Element must be empty");
        let text = element.innerText;
        element.innerText = "";
        for (let i = 0; i < text.length; i++) {
            let prop = i / segmentLength;
            let index = Math.floor(prop) % gradients.length;
            let t = prop % 1;
            let coloringElement = document.createElement("span");
            coloringElement.style.cssText = generateStyle(gradients[index].getAt(t), isBg);
            coloringElement.innerText = text[i];
            element.appendChild(coloringElement);
        }
    }
    exports.cyclicGradient = cyclicGradient;
});

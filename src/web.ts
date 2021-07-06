import { Color } from "./color";
import { Gradient } from "./gradient";

export function generateStyle(color: Color, isBg = false) : string {
    let result = isBg ? "background-color: " : "color: ";
    return result + `rgba(${color.r_8b}, ${color.g_8b}, ${color.b_8b}, ${color.alpha});`;
}

export function uniform(element: HTMLElement, color: Color, isBg = false) {
    if (element.children.length != 0) throw new Error("Element must be empty");
    let coloringElement = document.createElement("span");
    coloringElement.style.cssText = generateStyle(color, isBg);
    coloringElement.innerText = element.innerText;
    element.innerText = "";
    element.appendChild(coloringElement);
}

export function cyclicUniform(element: HTMLElement, segmentLength: number, isBg = false, ...colors: Color[]) {
    if (element.children.length != 0) throw new Error("Element must be empty");
    let text = element.innerText;
    element.innerText = "";
    for (let i = 0; i < text.length; i++) {

        let coloringElement = document.createElement("span");

        coloringElement.style.cssText = generateStyle(colors[Math.floor(i / segmentLength) % colors.length], isBg);
        coloringElement.innerText = text[i];
        element.appendChild(coloringElement);
    }
}

export function gradient(element: HTMLElement, gradient: Gradient, isBg = false) {
    if (element.children.length != 0) throw new Error("Element must be empty");
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

export function cyclicGradient(element: HTMLElement, segmentLength: number, isBg = true, ...gradients: Gradient[]) {
    if (element.children.length != 0) throw new Error("Element must be empty");
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
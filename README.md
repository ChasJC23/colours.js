# colours.js

This library is designed to simplify dealing with colours on JavaScript or TypeScript, and prove ease of access applying them to console environments. It can be used to customise the colours of console messages, supporting custom colours, gradients, and other simple patterns.

# Installation

`npm i colours.js`

# Usage

## Colours

The constructor for `Colour` expects numbers between 0 and 1 representing amount of red, green, blue, and an alpha value for opacity.

The opacity is set to 1 by default.

```js
const {Colour} = require("colours.js");

let myColour = new Colour(0.2, 0.8, 0.5);

// opacity is set to 0.1
let secretColour = new Colour(0.8, 0.3, 0.4, 0.1);
```

You can also create colours using a hex value, or from a different colour space entirely.

generating a colour from hex expects a string. The length of this string determines the format it assumes you've given the colour in. Generating a colour from hex does not account for the alpha value, which is automatically set to 1.

```js
const {Colour} = require("colours.js");

let myColour;

// 24-bit colour
myColour = Colour.fromHex("#456e04");

// 12-bit colour, shorthand for #6600ff
myColour = Colour.fromHex("#60f");

// create a colour using the HSV colour space
myColour = Colour.fromHSV(0.2, 0.9, 0.8);
```

These colours can be modified using attributes corresponding to the four available colour spaces RGB, HSV, HSI, and HSL

```js
// modifying the red component of the colour
myColour.red = 1.0;

// modifying the saturation of the colour in the HSL colour space
myColour.saturation_L = 0.6;

// getting the hue of the colour
let hue = myColour.hue;
```

And can be exported into arrays for all of these colour spaces, as well as some common other formats you may be working with

```js
let asRGB = myColour.toRGB();
let asRGBA = myColour.toRGBA();
let asHSV = myColour.toHSV();
let asHSI = myColour.toHSI();
let asHSL = myColour.toHSL();

// uses the integer ranges of 0 - 255 for each component
let as24bRGB = myColour.to24BitRGB();
let as32bRGBA = myColour.to32BitRGBA();
```

the `Colour` class also has static values corresponding to standard colours seen in CSS.

```js
let chocolateHue = Colour.CHOCOLATE.hue;
```

## Gradients

### Direct Gradients

You can create gradients between colours, using a variety of different routes using the already established colour spaces.

```js
const {Colour, DirectGradient, ColourSpace} = require("colours.js");

let firstColour = new Colour(0.2, 0.7, 0.4);
let secondColour = new Colour(0.8, 0.3, 0.5);

let myGradient = new DirectGradient(firstColour, secondColour, ColourSpace.HSV);
```

All gradients have a `getAt` method which allow you to find colours somewhere along the gradient, and can also be fully modified after creation.

```js
let middleColour = myGradient.getAt(0.5);

myGradient.startColour = Colour.fromHSL(0.1, 0.8, 0.5);

myGradient.space = ColourSpace.HSL;
```

The interpolation method used for the gradient can also be decided using the following options:

- `Interpolation.linear` linear interpolation
- `Interpolation.inc_quadratic` quadratic interpolation with start derivative of 0
- `Interpolation.dec_quadratic` quadratic interpolation with end derivative of 0
- `Interpolation.cubic` cubic interpolation

```js
const {Colour, DirectGradient, ColourSpace, Interpolation} = require("colours.js");

let myGradient = new DirectGradient(Colour.BLUE, Colour.GOLD, ColourSpace.HSV, Interpolation.cubic);
```

And for colour spaces where there is a cyclical component, there are more options for deciding the route.

```js
let myGradient = new DirectGradient(
    Colour.RED,
    Colour.GREEN,
    ColourSpace.HSV,
    Interpolation.linear,
    true, // whether to go the long way around the colour wheel or not
    0 // how many extra loops of the colour wheel to be made
);
```

Which allows you to create a wider variety of gradients such as:

```js
// if the number of loops of the colour wheel was omitted, we'd have a gradient of just red
let rainbow = new DirectGradient(Colour.RED, Colour.RED, ColourSpace.HSV, Interpolation.linear, false, 1);
let doubleRainbow = new DirectGradient(Colour.RED, Colour.RED, ColourSpace.HSV, Interpolation.linear, false, 2);

// going the long route means we go via yellow and green rather than through purple
let temperatureScale = new DirectGradient(Colour.RED, Colour.BLUE, ColourSpace.HSV, Interpolation.cubic, true, 0);
```

### Joined Gradients

If these already established options aren't enough, you can also create a more complex gradient, involving many direct gradients joined together with independent settings.

The constructor for the `JoinedGradient` class requires objects using the interface `GradientSegment`. The attributes you'll need in your segment are as follows (with optionals marked with `?`):

- `colour`: a `Colour` object specifying the ending colour of this segment.
- `length?`: a number indicating the relative length of this segment. By default, its value is `1`.
- `space?`: the colour space this segment will be interpolating through. By default, RGB is chosen.
- `interpolation?`: the method used for interpolation. By default, linear interpolation is chosen.
- `longRoute?`: a boolean value determining whether to go the long way around the colour wheel for cyclical colour spaces. By default, its value is `false`.
- `cycles?`: a number determiming how many complete cycles of the colour should be made for cyclical colour spaces. By default, its value is `0`.

An example of one of these gradients is as follows:

```js
const {Colour, JoinedGradient, ColourSpace, Interpolation} = require("colours.js");

let myGradient = new JoinedGradient(Colour.BLACK,
    {
        colour: Colour.DARKGREEN,
        length: 2,
        interpolation: Interpolation.dec_quadratic
    },
    {
        colour: Colour.PINK,
        length: 1,
        space: ColourSpace.HSL,
        longRoute: true
    },
    {
        colour: Colour.PURPLE,
        length: 3,
        interpolation: Interpolation.cubic,
        space: ColourSpace.HSV,
        cycles: 1
    }
);
```

Methods are also available to modify the constituent gradients used.

```js
// gets the first gradient
let start = jGradient.getGradient(0);

// sets the relative length of the third gradient to 2
jGradient.setGradientLength(2, 2);
```

## Colouring console messages

Colours and gradients created using this library can be applied to console messages, using the `console` module.

```js
const {Colour, DirectGradient, colourConsole, ColourSpace, Interpolation} = require("colours.js");

let msg = colourConsole.uniform("Hello World!", Colour.LIME);

// logs with the text coloured lime
console.log(msg);

msg = colourConsole.uniform(msg, Colour.INDIGO, true);

// logs with the background coloured indigo and with lime coloured text
console.log(msg);

let rainbow = new DirectGradient(Colour.RED, Colour.RED, ColourSpace.HSV, Interpolation.linear, true);

msg = colourConsole.gradient("I really love rainbows!", rainbow);

// logs with the text coloured with a rainbow gradient
console.log(msg);
```

Both direct and joined gradients can be used in the `console.gradient()` function.

You can also cycle between colours, or between gradients, using the cyclic versions of these functions:

```js
msg = colourConsole.cyclicUniform("This has a simple pattern!", 3, false, Colour.RED, Colour.GREEN, Colour.BLUE);
console.log(msg);

msg = colourConsole.cyclicGradient("This makes use of multiple different gradients next to each other!", 10, true, firstGradient, secondGradient, thirdGradient);
console.log(msg);
```

For which you need to specify the length of all segments, whether to colour in the foreground or background, and the list of colours or gradients you wish to use in the sequence.

# Examples
To demonstrate functionality of the language, some functions have been created as example:

```ts
import { Colour, ColourSpace, DirectGradient, JoinedGradient, colourConsole, Interpolation } from "colours.js";


export function fire(message: string, isBackground: boolean = false, inverted: boolean = false) {
    const fire = new JoinedGradient(inverted ? Colour.YELLOW : Colour.RED,
        {
            colour: Colour.ORANGE,
            interpolation: inverted ? Interpolation.dec_quadratic : Interpolation.inc_quadratic,
            length: inverted ? 1 : 2
        },
        {
            colour: inverted ? Colour.RED : Colour.YELLOW,
            space: ColourSpace.HSV
        }
    );

    return isBackground
        ? colourConsole.gradient(colourConsole.uniform(message, Colour.BLACK), fire, true)
        : colourConsole.gradient(message, fire);
}

export function ice(message: string, isBackground: boolean = false, inverted: boolean = false) {
    const ice = new DirectGradient(
        inverted ? Colour.SILVER : Colour.fromHex("#088fff"),
        inverted ? Colour.fromHex("#088fff") : Colour.SILVER,
        ColourSpace.RGB,
        inverted ? Interpolation.dec_quadratic : Interpolation.inc_quadratic
    );

    return isBackground
        ? colourConsole.gradient(colourConsole.uniform(message, Colour.BLACK), ice, true)
        : colourConsole.gradient(message, ice);
}

export function zebra(message: string, isBackground: boolean = false) {
    return isBackground
        ? colourConsole.cyclicUniform(colourConsole.cyclicUniform(message, 1, true, Colour.WHITE, Colour.BLACK), 1, false, Colour.BLACK, Colour.WHITE)
        : colourConsole.cyclicUniform(message, 1, false, Colour.WHITE, Colour.BLACK);
}
```
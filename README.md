# colours.js

This library is designed to simplify dealing with colours on both front and back end JavaScript or TypeScript.

## Front End

Able to apply created colours to element styling, allowing for gradients and patterns by automatically generating `<span>` tags.

## Back End

Can be used to customise the colours of console messages, supporting custom colours, gradients, and other simple patterns.

# Installation

npm i colours.js

# Usage

## Colours

The constructor for `Color` expects numbers between 0 and 1 representing amount of red, green, blue, and an alpha value for opacity.

The opacity is set to 1 by default.

```js
const {Color} = require("colours.js");

let myColor = new Color(0.2, 0.8, 0.5);

// opacity is set to 0.1
let secretColor = new Color(0.8, 0.3, 0.4, 0.1);
```

You can also create colours using a hex value, or from a different colour space entirely.

generating a colour from hex expects a string. The length of this string determines the format it assumes you've given the colour in. Generating a colour from hex does not account for the alpha value, which is automatically set to 1.

```js
const {Color} = require("colours.js");

let myColor;

// 24-bit colour
myColor = Color.fromHex("#456e04");

// 12-bit colour, shorthand for #6600ff
myColor = Color.fromHex("#60f");

// create a colour using the HSV colour space
myColor = Color.fromHSV(0.2, 0.9, 0.8);
```

These colours can be modified using attributes corresponding to the four available colour spaces RGB, HSV, HSI, and HSL

```js
// modifying the red component of the colour
myColor.red = 1.0;

// modifying the saturation of the colour in the HSL colour space
myColor.saturation_L = 0.6;

// getting the hue of the colour
let hue = myColor.hue;
```

And can be exported into arrays for all of these colour spaces, as well as some common other formats you may be working with

```js
let asRGB = myColor.toRGB();
let asRGBA = myColor.toRGBA();
let asHSV = myColor.toHSV();
let asHSI = myColor.toHSI();
let asHSL = myColor.toHSL();

// uses the integer ranges of 0 - 255 for each component
let as24bRGB = myColor.to24BitRGB();
let as32bRGBA = myColor.to32BitRGBA();
```

the `Color` class also has static values corresponding to standard colours seen in CSS.

```js
let chocolateHue = Color.CHOCOLATE.hue;
```

## Gradients

### Direct Gradients

You can create gradients between colours, using a variety of different routes using the already established colour spaces.

```js
const {Color, DirectGradient, ColorSpace} = require("colours.js");

let firstColor = new Color(0.2, 0.7, 0.4);
let secondColor = new Color(0.8, 0.3, 0.5);

let myGradient = new DirectGradient(firstColor, secondColor, ColorSpace.HSV);
```

All gradients have a `getAt` method which allow you to find colours somewhere along the gradient, and can also be fully modified after creation.

```js
let middleColor = myGradient.getAt(0.5);

myGradient.startColor = Color.fromHSL(0.1, 0.8, 0.5);

myGradient.space = ColorSpace.HSL;
```

The interpolation method used for the gradient can also be decided using the following options:

- `Interpolation.linear` linear interpolation
- `Interpolation.quadratic_inc` quadratic interpolation with start derivative of 0
- `Interpolation.quadratic_dec` quadratic interpolation with end derivative of 0
- `Interpolation.cubic` cubic interpolation

```js
const {Color, DirectGradient, ColorSpace, Interpolation} = require("colours.js");

let myGradient = new DirectGradient(Color.BLUE, Color.GOLD, ColorSpace.HSV, Interpolation.cubic);
```

And for colour spaces where there is a cyclical component, there are more options for deciding the route.

```js
let myGradient = new DirectGradient(
    Color.RED,
    Color.GREEN,
    ColorSpace.HSV,
    Interpolation.linear,
    true, // whether to go the long way around the colour wheel or not
    0 // how many extra loops of the colour wheel to be made
);
```

Which allows you to create a wider variety of gradients such as:

```js
// if the number of loops of the colour wheel was omitted, we'd have a gradient of just red
let rainbow = new DirectGradient(Color.RED, Color.RED, ColorSpace.HSV, Interpolation.linear, false, 1);
let doubleRainbow = new DirectGradient(Color.RED, Color.RED, ColorSpace.HSV, Interpolation.linear, false, 2);

// going the long route means we go via yellow and green rather than through purple
let temperatureScale = new DirectGradient(Color.RED, Color.BLUE, ColorSpace.HSV, Interpolation.cubic, true, 0);
```

### Joined Gradients

If these already established options aren't enough, you can also create a more complex gradient, involving many direct gradients joined together with independent settings.

The constructor for the `JoinedGradient` class requires objects using the interface `GradientSegment`. The attributes you'll need in your segment are as follows (with optionals marked with `?`):

- `color`: a `Color` object specifying the ending colour of this segment.
- `length?`: a number indicating the relative length of this segment. By default, its value is `1`.
- `space?`: the colour space this segment will be interpolating through. By default, RGB is chosen.
- `interpolation?`: the method used for interpolation. By default, linear interpolation is chosen.
- `longRoute?`: a boolean value determining whether to go the long way around the colour wheel for cyclical colour spaces. By default, its value is `false`.
- `cycles?`: a number determiming how many complete cycles of the colour should be made for cyclical colour spaces. By default, its value is `0`.

An example of one of these gradients is as follows:

```js
const {Color, JoinedGradient, ColorSpace, Interpolation} = require("colours.js");

let myGradient = new JoinedGradient(Color.BLACK,
    {
        color: Color.DARKGREEN,
        length: 2,
        interpolation: Interpolation.quadratic_dec
    },
    {
        color: Color.PINK,
        length: 1,
        space: ColorSpace.HSL,
        longRoute: true
    },
    {
        color: Color.PURPLE,
        length: 3,
        interpolation: Interpolation.cubic,
        space: ColorSpace.HSV,
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

## colouring HTML elements

The text colour, background colour, and border colour of elements can be changed to colours (and in some cases gradients) created using this library, using the `web` namespace.

```js
import {Color, DirectGradient, web, ColorSpace, Interpolation} from "colours.js";

// colours in the text in the given element uniformly
web.uniform(myElement, Color.MAROON);

// colours in the background of the element uniformly
web.uniform(myElement, Color.LIME, true);

let rainbow = new DirectGradient(Color.RED, Color.RED, ColorSpace.HSV, Interpolation.linear, true);

// colours in the text using a rainbow gradient
web.gradient(myElement, "I really love rainbows!", rainbow);
```

## colouring console messages

Colours and gradients created using this library can be applied to console messages, using the `colorConsole` namespace.

```js
const {Color, DirectGradient, colorConsole, ColorSpace, Interpolation} = require("colours.js");

let msg = colorConsole.uniform("Hello World!", Color.LIME);

// logs with the text coloured lime
console.log(msg);

msg = colorConsole.uniform(msg, Color.INDIGO, true);

// logs with the background coloured indigo and with lime coloured text
console.log(msg);

let rainbow = new DirectGradient(Color.RED, Color.RED, ColorSpace.HSV, Interpolation.linear, true);

msg = colorConsole.gradient("I really love rainbows!", rainbow);

// logs with the text coloured with a rainbow gradient
console.log(msg);
```

Both direct and joined gradients can be used in the `colorConsole.gradient()` function.

You can also cycle between colors, or between gradients, using the cyclic versions of these functions:

```js
msg = colorConsole.cyclicUniform("This has a simple pattern!", 3, false, Color.RED, Color.GREEN, Color.BLUE);
console.log(msg);

msg = colorConsole.cyclicGradient("This makes use of multiple different gradients next to each other!", 10, true, firstGradient, secondGradient, thirdGradient);
console.log(msg);
```

For which you need to specify the length of all segments, whether to colour in the foreground or background, and the list of colours or gradients you wish to use in the sequence.

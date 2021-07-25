node-red-contrib-chroma
=======================

A Node-RED node for color conversions
This node mostly is based on <a href="https://vis4.net/chromajs/">chroma.js</a> with additional formats like RGBW and CIExyz

*chroma.js is a small-ish zero-dependency JavaScript library (13.5kB) for all kinds of color conversions and color scales*

## features

* conversion between various color formats
* conversion between array format (chroma.js default) and objects
* scaling of relative values either as `0..1` or `0..100`
* support of floating point and integer values
* chroma.js api accessible to
  * manipulate colors
  * generate color scales

## latest updates

### 0.0.3 
* fix: return callback function
* updated examples
* various minor fixes and typos

## Install

Either use the Editor - Menu - Manage Palette - Install option, or run the following command in your Node-RED user directory (typically `~/.node-red`) after installing Node-RED-dashboard.

    npm i node-red-contrib-chroma

## Examples

Examples can be imported via **import/examples** in the top right menu of the editor

1. `conversions` test of all (except alpha channel) available formats
2. `mix` use of chroma
3. `interactive scale` use of chroma scales using the api (with a dashboard slider as input and a button to show the resulting color)

## inputs

### msg.payload

Alpha channel is supported to most color formats.

For relative values select the format `0..1` or `0..100` to be expected.

chroma.js input formats

- Hex string: "#ff0000"
- RGB string: "rgb(255, 0, 0)"
- RGB object: {r: 255, g: 0, b: 0}
- HSL string: "hsl(360, 50%, 100%)"
- HSL object: {h: 360, s: 50, l: 100}
- HSV object: {h: 360, s: 100, v: 50}
- HSI object: {h: 360, s: 100, i: 50}
- LAB object: {l: 1, a: 1, b: 1}
- LCH object: {l: 1, c: 1, h: 1}
- named colors: `string`
- temperature: `number` 1000..40,000 k
- luminance: `number` 0..1

additional formats

- RGBW object {r:255, g:255, b:255, w:255} *useful for RGBW LEDs
- CIExyz object {x:1, y:1, z:1} *for home automation like zigbee*

Node: CIExy can't be used as input as it can't be converted clearly to RGB *(or somebody can to show me how)*

### msg.api

the api can be accessed by sending an `array`of `objects`

The first example of the [chroma.js api documentation](https://vis4.net/chromajs):

```javascript
chroma.scale(['#fafa6e','#2A4858']).mode('lch').colors(6)
```

translates to

```JSON
[
    { "scale": ["#fafa6e","#2A4858"] },
    { "mode": "lch" },
    { "colors": 6 }
]
```

This example will generate a six colors scale form yellow to dark green

If the api call returns a function `msg.payload` will be used as it's parameter.
Subsequent messages (without `msg.api`) will return the result of the returned callback function

If no `msg.payload` is sent the callback function is send to the output (to be tested further).


## output

All supported input formats can be selected as output. In addition CIExy can be selected

All chroma.js multi value results are formatted as an `array`. Tick the option to get the result as an `object`

For relative values select the format `0..1` or `0..100` to be emitted.

Numerical values can be rounded integers or returned as float values





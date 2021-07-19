const {min,sqrt,acos,cos,pow,atan} = Math;
const PI = Math.PI;
const TWOPI = Math.PI*2;
const PITHIRD = Math.PI/3;
// import { limit } from './utils';
const {limit,array2object} = require('./utils');
const {functionDef} = require('./definitions');

class ColorPlus {
  chroma = require('chroma-js');
  _color = null;
  constructor(...args) {
    switch (this.getColorType(args[0])) {
      case 'rgb':
        this._color = this.chroma(args[0]);
        return this;
      case 'rgbw':
        this._color = this.chroma(this.rgbw2hsv(args[0]));
        return this._color;
      case 'CIExyz':
        this._color = this.chroma(this.xyz2rgb(args[0]));
        return this._color;
      case 'CIExy':
        this.error="CIE xy can't be used as input";
        break;
    }
    this._color = null;
    return;
  }
  get rgbw() {
    if (this._color !== null) {
      return this.hsv2rgbw(array2object(this._color.hsv(false),['h','s','v']));
    }
  }
  get xyz() {
    if (this._color !== null) {
      return this.rgb2xyz(array2object(this._color.rgb(false),['r','g','b']));
    }
  }
  get xy() {
    if (this._color !== null) {
      return this.rgb2xy(array2object(this._color.rgb(false),['r','g','b']));
    }
  }

  getColorType = function (color) {
    for (let def in functionDef) {
      if ((functionDef[def].lib === 'chromaPlus' || def === 'rgb') && (Object.keys(color)).length === functionDef[def].params.length) {
        checkBlock : {
          for (let param of functionDef[def].params) {
            if (!color.hasOwnProperty(param)) break checkBlock;
          }
          return def;
        }
      }
    }
    return '';
  }
  /** 
  * @brief sRGB gamma correction, transforms R to R'
  * http://en.wikipedia.org/wiki/SRGB
  */
  forwardGammaSRGB(t)	{
    return (((t) <= 0.0031306684425005883) ? (12.92*(t)) : (1.055*pow((t), 0.416666666666666667) - 0.055))
  }
  /** 
  * @brief Inverse sRGB gamma correction, transforms R' to R 
  */
  invGammaSRGB(t)	{
  return (((t) <= 0.0404482362771076) ? ((t)/12.92) : pow(((t) + 0.055)/1.055, 2.4))
  }
  /**
  *  convert rgbw color model into hsv
  *   @param  {object} input {r:255,g:255,b:255}
  *   @return {object} {h:360,s:100,v:100}
  */
  rgbw2hsv(input) {
    let r = limit(input.r,0,255);
    let g = limit(input.g,0,255);
    let b = limit(input.b,0,255);
    let w = limit(input.w,0,255);

    // calculate hue out of the rgb component only
    let H = 0;
    const min_ = min(r,g,b);
    const i = (r+g+b) / 3;
    const s = i > 0 ? 1 - min_/i : 0;
    if (s === 0) {
        H = 0; 
    } else {
        H = ((r-g)+(r-b)) / 2;
        H /= sqrt((r-g)*(r-g) + (r-b)*(g-b));
        H = acos(H);
        if (b > g) {
            H = TWOPI - H;
        }
        H /= TWOPI;
    }
        
    // calculate saturation and value out of RGBW

    let argH;
    let argI;
    // check what sector we are in
    if (b == 0) {
        // between 0 and 2*pi/3
        argH = (g+r) / (2*r-g);
        argI = r;
    }
    if (r == 0) {
        // between 2*pi/3 and 4*pi/3
        argH = (b+g) / (2*g-b);
        argI = g;
    }
    if (g == 0) {
        // between 4*pi/3 and 6*pi/3
        argH = (r+b) / (2*b-r);
        argI = b;
    }

    var I = (((3 * argI) / (1 + 1/argH)) + w) / 255;
    var S = 1 - w / (255*I)

    var output = {
        h : limit(H) * 360,
        s : limit(S),
        v : limit(I)
    }
    //console.log(`rgbw2hsv`, input,output);
    return output;
  }
  /**
  *  convert hsv color model into rgbW
  *   @param  {object} input  {h:360,s:100,i:100}
  *   @return {object} {r:255,g:255,b:255}
  */
  // Source https://blog.saikoled.com/post/44677718712/how-to-convert-from-hsi-to-rgb-white
  hsv2rgbw(input) {
    var fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };
    var cos_h, cos_1047_h;
    var H = fmod(input.h,360); // cycle H around to 0-360 degrees
    H = 3.14159*H/180; // Convert to radians.
    var S = limit(input.s);
    var I = limit(input.v);
    var r,g,b,w;

    if(H < 2.09439) {
        cos_h = cos(H);
        cos_1047_h = cos(1.047196667-H);
        r = S*255*I/3*(1+cos_h/cos_1047_h);
        g = S*255*I/3*(1+(1-cos_h/cos_1047_h));
        b = 0;
        w = 255*(1-S)*I;
    } else if(H < 4.188787) {
        H = H - 2.09439;
        cos_h = cos(H);
        cos_1047_h = cos(1.047196667-H);
        g = S*255*I/3*(1+cos_h/cos_1047_h);
        b = S*255*I/3*(1+(1-cos_h/cos_1047_h));
        r = 0;
        w = 255*(1-S)*I;
    } else {
        H = H - 4.188787;
        cos_h = cos(H);
        cos_1047_h = cos(1.047196667-H);
        b = S*255*I/3*(1+cos_h/cos_1047_h);
        r = S*255*I/3*(1+(1-cos_h/cos_1047_h));
        g = 0;
        w = 255*(1-S)*I;
    }
    var output = {
        r: limit(r,0,255),
        g: limit(g,0,255),
        b: limit(b,0,255),
        w: limit(w,0,255)
    }
    //console.log(`hsv2rgbw`, input,output);
    return output;
  }
  /**
  * @brief Transform sRGB to CIE XYZ with the D65 white point
  *
  *   @param  {object} input  {r:255,g:255,b:255}
  *   @return {object} {x:1,y:1,z:1}
  *
  * http://github.com/flatironinstitute/isosplit5/blob/master/matlab/visualization/colorspace/colorspace.c
  * Poynton, "Frequently Asked Questions About Color," page 10 
  * Wikipedia: http://en.wikipedia.org/wiki/SRGB
  * Wikipedia: http://en.wikipedia.org/wiki/CIE_1931_color_space
  */
  rgb2xyz(input)
  {
    let R = limit(this.invGammaSRGB(input.r / 255));
    let G = limit(this.invGammaSRGB(input.g / 255));
    let B = limit(this.invGammaSRGB(input.b / 255));
    var output = {}
    output.x = (0.4123955889674142161*R + 0.3575834307637148171*G + 0.1804926473817015735*B);
    output.y = (0.2125862307855955516*R + 0.7151703037034108499*G + 0.07220049864333622685*B);
    output.z = (0.01929721549174694484*R + 0.1191838645808485318*G + 0.9504971251315797660*B);
    return output;
  }
  /**
   * @brief Transform CIE XYZ to sRGB with the D65 white point
   *
   *  @param   {object} input {x:1,y:1,z:1}
   *  @return  {object} {r:255,g:255,b:255}
   *
   * http://github.com/flatironinstitute/isosplit5/blob/master/matlab/visualization/colorspace/colorspace.c
   * Official sRGB specification (IEC 61966-2-1:1999)
   * Poynton, "Frequently Asked Questions About Color," page 10
   * Wikipedia: http://en.wikipedia.org/wiki/SRGB
   * Wikipedia: http://en.wikipedia.org/wiki/CIE_1931_color_space
   */
  xyz2rgb(input) {
    let R1 = ( 3.2406*input.x - 1.5372*input.y - 0.4986*input.z);
    let G1 = (-0.9689*input.x + 1.8758*input.y + 0.0415*input.z);
    let B1 = ( 0.0557*input.x - 0.2040*input.y + 1.0570*input.z);
    
    let Min = min(...[R1, G1, B1]);
    
    /* Force nonnegative values so that gamma correction is well-defined. */
    if(Min < 0)
    {
      R1 -= Min;
      G1 -= Min;
      B1 -= Min;
    }
  
    /* Transform from RGB to R'G'B' */
    var output = {};
    output.r = limit(this.forwardGammaSRGB(R1)*255,0,255);
    output.g = limit(this.forwardGammaSRGB(G1)*255,0,255);
    output.b = limit(this.forwardGammaSRGB(B1)*255,0,255);
    return output;
  }
  /**
  * @brief Transform sRGB to CIE XY with the D65 white point
  *
  *   @param  {object} input  {r:255,g:255,b:255}
  *   @return {object} {x:1,y:1}
  **/
  rgb2xy(input) {
    input = this.rgb2xyz(input);
    let x = input.x;
    let y = input.y;
    let z = input.z;
    
    var output = {};
    output.x = limit(x / (x + y + z));
		output.y = limit(y / (x + y + z));
		return output;
  }
}

module.exports = ColorPlus;
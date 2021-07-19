const percentProperties = ['s','v','l','i'];
const limit = require('./limit');
/**
*  scalePercent: scales up/down percentage values
*   @param  {any} input payload to be analysed and scaled if object
*   @param  {number} factor 0.1 to downscale and 100 to upscale
*   @return {any} scaled object
*/
module.exports =  (input, factor = 0.01) => {
  if (typeof input === 'object') {
    for (let item in input) {
      if (percentProperties.includes(item)) {
        input[item] = limit (input[item] * factor,0,(factor===0.01) ? 1 : 100);
      }
    }
  }
  return input;
}
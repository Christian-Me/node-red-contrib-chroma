/**
*  limit value between min and max value
*   @param  {number} x Value
*   @param  {number} min = 0 Minimum
*   @param  {number} max = 1 Maximum
*   @return {number} adjusted value
*/
module.exports = (x, min=0, max=1) => {
  return x < min ? min : x > max ? max : x;
}
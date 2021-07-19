const {functionDef} = require('../definitions');

module.exports =  (color) => {
  if (typeof color === 'string') {
    color.trim();
    if (color.startsWith('rgb')) return 'rgbString';
    if (color.startsWith('rgba')) return 'rgbaString';
    if (color.startsWith('hsl')) return 'hslString';
    if (color.startsWith('hsla')) return 'hslaString';
    if (color.startsWith('#')) {
      if (color.length>7) return 'hexa';
      return 'hex';
    }
    return 'named';
  }
  if (typeof color !== 'object') return;
  for (let def in functionDef) {
    if (functionDef[def].hasOwnProperty('params') && Object.keys(color).length === functionDef[def].params.length) {
      checkBlock : {
        for (let param of functionDef[def].params) {
          if (!color.hasOwnProperty(param)) break checkBlock;
        }
        return def;
      }
    }
  }
  return;
}
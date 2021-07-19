const limit = require('./limit');

module.exports = (payload,params) => {
  if (typeof payload === "object" && Array.isArray(payload)) {
    var output = {};
    payload.forEach((item,index) => {
      if (params[index]!== undefined) output[params[index]]=item;
    })
    return output;
  }
  return payload;
}
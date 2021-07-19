const chromaPlus = (...args) => {
  return new chromaPlus.Color(...args);
};
chromaPlus.Color = require('./ColorPlus');

module.exports = chromaPlus;
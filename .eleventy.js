const fs = require('fs');

class ModularClassName {
  constructor(output) {
    this._output = output;
    this._cache = new Map();
  }
  getClassName(css, className) {
    if (!css.startsWith('/')) {
      throw new TypeError('CSS path must be absolute (starts with /)');
    }

    // TODO: for watch mode, watch for changes to CSS JSON
    if (!this._cache.has(css)) {
      const json = fs.readFileSync(this._output + css + '.json', {
        encoding: 'utf8',
      });
      this._cache.set(css, JSON.parse(json));
    }

    const data = this._cache.get(css);

    if (!(className in data)) {
      throw new TypeError(`Cannot find className "${className}" in ${css}`);
    }

    return data[className];
  }
}

module.exports = function(eleventyConfig) {
  const config = {
    dir: {
      input: 'src',
      output: '.build-tmp',
    },
  };

  const modCSS = new ModularClassName(config.dir.output);

  eleventyConfig.addShortcode('className', (css, className) => {
    return modCSS.getClassName(css, className);
  });

  return config;
};
const fs = require('fs');
const path = require('path');

class Locke {
  /**
   * @constructor The starting point of Locke
   * @param {Object} [options] The options for initializing Locke
   * @param {Object} [options.localesDir='locales'] The name of the directory
   * where locales are stored.
   * @param {Object} [options.defaultLocale='en_us'] The default locale.
   */
  constructor(options = {}) {
    // Directory wheere locales are stored.
    if (options && options.localesDir && typeof options.localesDir === 'string') {
      this._localesDir = options.localesDir;
    }
    else {
      this._localesDir = 'locales';
    }
    if (!fs.existsSync(`./${this._localesDir}`)) {
      throw new Error(`The specified locales directory '${this._localesDir}' was not.`);
    }

    // Available locales
    this._locales = fs.readdirSync(`./${this._localesDir}/`).filter(file => fs.statSync(path.join(`./${this._localesDir}/`, file)).isDirectory());

    // Constant/global values across all locales
    let constantsPath = path.resolve(`./${this._localesDir}/constants.json`);
    this._constants = fs.existsSync(constantsPath) ? require(constantsPath) : null;
    this._constantsRegExp = this._constants ? new RegExp(Object.keys(this._constants).join('|'), 'gi') : null;

    // Default Locale
    if (options && options.defaultLocale && typeof options.defaultLocale === 'string' && this._locales.includes(options.defaultLocale)) {
      this._defaultLocale = options.defaultLocale
    }
    else {
      this._defaultLocale = 'en_us';
    }

    // Available strings
    this._strings = new Map();
    for (let locale of this._locales) {
      let files = fs.readdirSync(`./${this._localesDir}/${locale}`);

      let strings = {};
      for (let file of files) {
        let stringFile = file.substr(0, file.length - 5);
        file = JSON.parse(fs.readFileSync(`./${this._localesDir}/${locale}/${file}`, { encoding: 'utf-8' }));
        strings[stringFile] = file;
      }

      this._strings.set(locale, strings);
    }
  }

  // Returns a string for the specified key in the specified language in the specified namespace.
  _getString(ns, l, k) {
    if (!this._strings.has(l)) l = this._defaultLocale;

    if (!this._strings.get(l)[ns] || !this._strings.get(l)[ns].hasOwnProperty(k)) {
      if (l === this._defaultLocale) {
        return `No string found for the '${k}' key.`;
      }
      return this._getString(ns, this._defaultLocale, k);
    }

    if (this._constantsRegExp) {
      return this._strings.get(l)[ns][k].replace(this._constantsRegExp, matched => this._constants[matched]);
    }
    return this._strings.get(l)[ns][k];
  }

  /**
   * Returns a info string for the specified key in the specified language.
   * @method info
   * @param {String} locale The locale of the string to get
   * @param {String} key The key of the string to get
   */
  info(locale, key) {
    return this._getString('info', locale, key);
  }

  /**
   * Returns a warn string for the specified key in the specified language.
   * @method warn
   * @param {String} locale The locale of the string to get
   * @param {String} key The key of the string to get
   */
  warn(locale, key) {
    return this._getString('warn', locale, key);
  }

  /**
   * Returns a error string for the specified key in the specified language.
   * @method error
   * @param {String} locale The locale of the string to get
   * @param {String} key The key of the string to get
   */
  error(locale, key) {
    return this._getString('error', locale, key);
  }
}

module.exports = Locke;

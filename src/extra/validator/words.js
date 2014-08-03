// minwords, maxwords, words extra validators
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.validators = window.ParsleyConfig.validators || {};
window._countWords = function (string) {
  return string
      .replace( /(^\s*)|(\s*$)/gi, "" )
      .replace( /[ ]{2,}/gi, " " )
      .replace( /\n /, "\n" )
      .split(' ').length;
};

window.ParsleyConfig.validators.minwords = {
  fn: function (value, nbWords) {
    return window._countWords(value) >= nbWords;
  },
  priority: 32
};

window.ParsleyConfig.validators.maxwords = {
  fn: function (value, nbWords) {
    return window._countWords(value) <= nbWords;
  },
  priority: 32
};

window.ParsleyConfig.validators.words = {
  fn: function (value, arrayRange) {
    var length = window._countWords(value);
    return length >= arrayRange[0] && length <= arrayRange[1];
  },
  priority: 32
};

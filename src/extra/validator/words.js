// minwords, maxwords, words extra validators
window._countWords = function (string) {
  return string
      .replace( /(^\s*)|(\s*$)/gi, "" )
      .replace( /[ ]{2,}/gi, " " )
      .replace( /\n /, "\n" )
      .split(' ').length;
};

ParsleyValidator.addValidator(
	'minwords',
	function (value, nbWords) {
		return window._countWords(value) >= nbWords;
	}, 32)
	.addMessage('en', 'minwords', 'This value needs more words');

ParsleyValidator.addValidator(
	'maxwords',
	function (value, nbWords) {
		return window._countWords(value) <= nbWords;
	}, 32)
	.addMessage('en', 'maxwords', 'This value needs fewer words');

ParsleyValidator.addValidator(
	'words',
	function (value, arrayRange) {
		var length = window._countWords(value);
		return length >= arrayRange[0] && length <= arrayRange[1];
	}, 32)
	.addMessage('en', 'words', 'This value has the incorrect number of words');

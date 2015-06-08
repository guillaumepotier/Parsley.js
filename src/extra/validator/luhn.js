// luhn extra validators
window.ParsleyValidator.addValidator(
	'luhn',
	function (value) {
	    value = value.replace(/[ -]/g, '');
	    var digit, n, sum, _j, _len1, _ref2;
	    sum = 0;
	    _ref2 = value.split('').reverse();
	    for (n = _j = 0, _len1 = _ref2.length; _j < _len1; n = ++_j) {
	        digit = _ref2[n];
	        digit = +digit;
	        if (n % 2) {
	            digit *= 2;
	            if (digit < 10) {
	                sum += digit;
	            } else {
	                sum += digit - 9;
	            }
	        } else {
	            sum += digit;
	        }
	    }
	    return sum % 10 === 0;
	}, 32)
	.addMessage('en', 'luhn', 'Invalid credit card');

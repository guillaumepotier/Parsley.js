window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    validators: {
      es_dni: function () {
        return {
          validate: function ( val, elem, self ) {
            var letter, letters, number;

            letters = 'TRWAGMYFPDXBNJZSQVHLCKET';
            val = val.replace("-", "");
            val = val.toUpperCase();
            number = val.substring(0, val.length - 1);
            letter = val[val.length - 1];

            if (!/\d+/.test(number)) {
              return false;
            }
            if (!letters.indexOf(letter) < 0) {
              return false;
            }
            return letter == letters[parseInt(number, 10) % 23];
          }
          , priority: 32
        }
      }
      , es_postalcode: function () {
        return {
          validate: function(val, elem, self) {
            var provinceCode;

            if (!/^\d{5}$/.test(val)) {
              return false;
            }
            provinceCode = parseInt(val.substring(0,2), 10);
            if (provinceCode > 52 || provinceCode < 1) {
              return false;
            }
            return true;
          }
          , priority: 32
        }
      }
      , es_ssn: function () {
        return {
          validate: function(val, elem, self) {
            var a, b, c, code, d;

            val = val.replace(/[ \/-]/g, "");
            if (!/^\d{12}$/.test(val)) {
              return false;
            }

            a = val.substring(0, 2);
            b = val.substring(2, 10);
            code = val.substring(10, 12);

            if (parseInt(b, 10) < 10000000) {
              d = parseInt(b, 10) + (parseInt(a, 10) * 10000000);
            } else {
              d = a + b.replace(/0*$/, "");
            }
            c = parseInt(d) % 97;
            return c === parseInt(code);
          }
          , priority: 32
        }
      }
      , es_ccc: function () {
        return {
          validate: function(val, elem, self) {
            var account, controlCode, entity, firstCode, firstCodeMod,
                firstCodeResult, office, secondCode, secondCodeMod,
                secondCodeResult, weight, x;

            val = val.replace(/[ -]/g, "");
            if (!/\d{20}$/.test(val)) {
              return false;
            }

            weight = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6];
            entity = val.substring(0, 4);
            office = val.substring(4, 8);
            controlCode = val.substring(8, 10);
            account = val.substr(10, 20);
            firstCode = "00" + entity + office;
            secondCode = account;
            firstCodeResult = 0;
            for (x = 0; x < 10; x++) {
              firstCodeResult += parseInt(firstCode[x], 10) * weight[x];
            }
            firstCodeMod = firstCodeResult % 11;
            firstCodeResult = 11 - firstCodeMod;
            if (firstCodeResult === 10) {
              firstCodeResult = 1;
            }
            if (firstCodeResult === 11) {
              firstCodeResult = 0;
            }
            secondCodeResult = 0;
            for (x = 0; x < 10; x++) {
              secondCodeResult += parseInt(secondCode[x], 10) * weight[x];
            }
            secondCodeMod = secondCodeResult % 11;
            secondCodeResult = 11 - secondCodeMod;
            if (secondCodeResult === 10) {
              secondCodeResult = 1;
            }
            if (secondCodeResult === 11) {
              secondCodeResult = 0;
            }
            if (firstCodeResult === parseInt(controlCode[0]) && secondCodeResult === parseInt(controlCode[1])) {
              return true;
            }
            return false;
          }
          , priority: 32
        }
      }
      , es_cif: function () {
        return {
          validate: function(val, elem, self) {
            var oddSum, evenSum, totalSum, controlCode, controlDigit, reminder,
                letter, number, oddNumbers, provinceCode, x, _i, _len;

            val = val.replace(/-/g, "").toUpperCase();

            if (!/^[ABCDEFGHJKLMNPRQSUVW]\d{7}[\d[ABCDEFGHIJ]$/.test(val)) {
              return false;
            }

            letter = val.substring(0, 1);
            provinceCode = val.substring(1, 3);
            number = val.substring(3, 8);
            controlCode = val.substring(8, 9);

            if (/[CKLMNPQRSW]/.test(letter) && /\d/.test(controlCode)) {
              return false;
            }
            if (/[ABDEFGHJUV]/.test(letter) && /[A-Z]/.test(controlCode)) {
              return false;
            }

            oddSum = parseInt(provinceCode[1], 10) + parseInt(number[1], 10) + parseInt(number[3], 10);

            evenSum = 0;
            oddNumbers = [
              parseInt(provinceCode[0], 10),
              parseInt(number[0], 10),
              parseInt(number[2], 10),
              parseInt(number[4], 10)
            ];
            for (_i = 0, _len = oddNumbers.length; _i < _len; _i++) {
              number = oddNumbers[_i];
              x = number * 2;
              if (x >= 10) {
                x = (x % 10) + 1;
              }
              evenSum += x;
            }
            totalSum = oddSum + evenSum;
            reminder = totalSum % 10;
            if (reminder !== 0) { controlDigit = 10 - reminder; } else { controlDigit = 0; }

            if (controlCode !== controlDigit.toString() && 'JABCDEFGHI'[controlDigit] !== controlCode) {
              return false;
            }
            return true;
          }
          , priority: 32
        }
      }
    }
    , messages: {
      es_dni:         "This value should be a valid DNI (Example: 00000000T)."
      , es_cif:         "This value should be a valid CIF (Example: B00000000)."
      , es_postalcode:  "This value should be a valid spanish postal code (Example: 28080)."
      , es_ssn:         "This value should be a valid spanish social security number."
      , es_ccc:         "This value should be a valid spanish bank client account code."
    }
  });
}(window.jQuery || window.Zepto));

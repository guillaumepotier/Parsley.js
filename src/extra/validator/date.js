window.Parsley.addValidator('date', {
    validateString: function(value, format) {
        if (! value) {
            return true;
        }

        var date = moment(value, format, true);
        return date.isValid();
    },
    priority: 255,
});

window.Parsley.addValidator('datebeforenow', {
    validateString: function(value, format) {
        if (! value) {
            return true;
        }

        var date = moment(value, format, true);

        if (! date.isValid()) {
            return false;
        }

        return date.isBefore(moment());
    },
    priority: 256,
});

window.Parsley.addValidator('dateafternow', {
    validateString: function(value, format) {
        if (! value) {
            return true;
        }

        var date = moment(value, format, true);

        if (! date.isValid()) {
            return false;
        }

        return date.isAfter(moment());
    },
    priority: 256,
});

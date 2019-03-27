window.Parsley.addValidator('date', {
    validateString: function(value, format) {
        var date = moment(value, format, true);
        return date.isValid();
    },
    priority: 256,
});

window.Parsley.addValidator('datebeforenow', {
    validateString: function(value, format) {
        var date = moment(value, format, true);
        
        // Trick to collaborate with date validator
        if (! date.isValid()) {
            return true;
        }
        
        return date.isBefore(moment());
    },
    priority: 256,
});

window.Parsley.addValidator('dateafternow', {
    validateString: function(value, format) {
        var date = moment(value, format, true);
        
        // Trick to collaborate with date validator
        if (! date.isValid()) {
            return true;
        }
        
        return date.isAfter(moment());
    },
    priority: 256,
});

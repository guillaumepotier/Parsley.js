window.Parsley.addValidator('date', {
    validateString: function(value, format) {
        if (! value) {
            return true;
        }
      
        var date = moment(value, format, true);
        return date.isValid();
    },
    priority: 256,
});

window.Parsley.addValidator('datebeforenow', {
    validateString: function(value, format) {
        if (! value) {
            return true;
        }
        
        if (! date.isValid()) {
            return true;
        }
        
        var date = moment(value, format, true);
        
        return date.isBefore(moment());
    },
    priority: 256,
});

window.Parsley.addValidator('dateafternow', {
    validateString: function(value, format) {
        if (! value) {
            return true;
        }
        
        if (! date.isValid()) {
            return true;
        }
        
        var date = moment(value, format, true);
        
        return date.isAfter(moment());
    },
    priority: 256,
});

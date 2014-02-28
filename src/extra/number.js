window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.validators = window.ParsleyConfig.validators || {};

window.ParsleyConfig.validators.greaterthan = {
    fn: function (value, fieldIdOrValue) {
        var otherValue = $.isNumeric(fieldIdOrValue)
            ? fieldOrValue
            : document.getElementById(fieldIdOrValue).value;

        return value > otherValue;
    },
    priority: 32
};

window.ParsleyConfig.validators.greaterorequalthan = {
    fn: function (value, fieldIdOrValue) {
        var otherValue = $.isNumeric(fieldIdOrValue)
            ? fieldOrValue
            : document.getElementById(fieldIdOrValue).value;

        return value >= otherValue;
    },
    priority: 32
};

window.ParsleyConfig.validators.lesserthan = {
    fn: function (value, fieldIdOrValue) {
        var otherValue = $.isNumeric(fieldIdOrValue)
            ? fieldOrValue
            : document.getElementById(fieldIdOrValue).value;

        return value < otherValue;
    },
    priority: 32
};

window.ParsleyConfig.validators.lesserorequalthan = {
    fn: function (value, fieldIdOrValue) {
        var otherValue = $.isNumeric(fieldIdOrValue)
            ? fieldOrValue
            : document.getElementById(fieldIdOrValue).value;

        return value <= otherValue;
    },
    priority: 32
};

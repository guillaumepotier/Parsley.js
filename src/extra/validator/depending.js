// requiredonradio, requiredoncheckbox extra validators
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.validators = window.ParsleyConfig.validators || {};

// example: data-parsley-requiredonradio="usertype:company"
// field is required if radio with name 'usertype' has the value 'company'
window.ParsleyConfig.validators.requiredonradio = {
    fn: function(value, requirements){
        requirements = requirements.split(':');
        if( requirements[1] == $('[name="' + requirements[0] + '"]:checked').val() && '' == value ){
            return false;
        }
        return true;
    },
    priority: 32
};

// example: data-parsley-requiredoncheckbox="delivery"
// field is required if checkbox with name 'delivery' is checked
window.ParsleyConfig.validators.requiredoncheckbox = {
    fn: function(value, requirement){
        if( $('[name="' + requirement + '"]').prop('checked') && '' == value ){
            return false;
        }
        return true;
    },
    priority: 32
};

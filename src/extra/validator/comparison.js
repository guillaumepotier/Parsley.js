// Greater than validator
window.ParsleyValidator.addValidator('gt', 
    function (value, requirement) {
        return parseFloat(value) > parseFloat($(requirement).val());
    }, 32)
    .addMessage('en', 'gt', 'This value should be greater');

// Greater than or equal to validator
window.ParsleyValidator.addValidator('gte', 
    function (value, requirement) {
        return parseFloat(value) >= parseFloat($(requirement).val());
    }, 32)
    .addMessage('en', 'gte', 'This value should be greater or equal');

// Less than validator
window.ParsleyValidator.addValidator('lt', 
    function (value, requirement) {
        return parseFloat(value) < parseFloat($(requirement).val());
    }, 32)
    .addMessage('en', 'lt', 'This value should be less');

// Less than or equal to validator
window.ParsleyValidator.addValidator('lte', 
    function (value, requirement) {
        return parseFloat(value) <= parseFloat($(requirement).val());
    }, 32)
    .addMessage('en', 'lte', 'This value should be less or equal');

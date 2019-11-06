// Load this after Parsley for additional date comparison validators
// Note: comparing with a reference isn't well supported and not recommended.
// import jQuery from 'jquery'; // Remove this line in ES3

// date-gt, date-lt extra validators

// data-parsley-date-gt
window.Parsley
    .addValidator('dateGt', {
        requirementType: 'string',
        validateString: function(value, requirement) {

            // get the values of targeted input as an array
            let comparedToDate = $(requirement).val().split('-');
            // get the values of initial input as an array
            let comparedDate = value.split('-');

            let i;
            for (i = 0; i < comparedToDate.length; i++) {
                if (comparedToDate[i] !== comparedDate[i]) {
                    return comparedDate[i] > comparedToDate[i];
                }
            }

        },
        messages: {
            en: 'This date must be far.',
            fr: 'Cette date doit être plus loin'
        }
    });

// data-parsley-date-lt
window.Parsley
    .addValidator('dateLt', {
        requirementType: 'string',
        validateString: function(value, requirement) {

            // get the values of targeted input as an array
            let comparedToDate = $(requirement).val().split('-');
            // get the values of initial input as an array
            let comparedDate = value.split('-');

            let i;
            for (i = 0; i < comparedToDate.length; i++) {
                if (comparedToDate[i] !== comparedDate[i]) {
                    return comparedDate[i] < comparedToDate[i];
                }
            }
        },
        messages: {
            en: 'This date must be near.',
            fr: 'Cette date doit être plus proche'
        }
    });
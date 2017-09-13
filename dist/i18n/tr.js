// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('tr', {
    defaultMessage: "Girdiğiniz değer geçerli değil.",
    type: {
        email: "Geçerli bir e-posta olmalıdır.",
        url: "Geçerli bir bağlantı adresi olmalıdır.",
        number: "Geçerli bir sayı olmalıdır.",
        integer: "Geçerli bir tamsayı olmalıdır.",
        digits: "Geçerli bir rakam olmalıdır.",
        alphanum: "Geçerli bir alfanümerik değer olmalıdır."
    },
    notblank: "Bu alan boş bırakılamaz.",
    required: "Bu alan gereklidir.",
    pattern: "Girdiğiniz biçim geçerli değil.",
    min: "Bu alan en az %s değerinde olmalıdır.",
    max: "Bu alan en fazla %s değerinde olmalıdır.",
    range: "Bu alan %s ve %s değerleri arasında olmalıdor.",
    minlength: "Bu alan en az %s karakter uzunluğunda olmalıdır.",
    maxlength: "Bu alan en fazla %s karakter uzunluğunda olmalıdır.",
    length: "Bu alanın uzunluğu %s ve %s karakter arasında olmalıdır.",
    mincheck: "En az %s adet seçim yapmalısınız.",
    maxcheck: "En fazla %s seçim yapabilirsiniz.",
    check: "Bu alan için en az %s, en fazla %s seçim yapmalısınız.",
    equalto: "Bu alanın değeri aynı olmalı."
});

Parsley.setLocale('tr');

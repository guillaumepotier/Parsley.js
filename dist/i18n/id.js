// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('id', {
  defaultMessage: "tidak valid",
  type: {
    email:        "Alamat email tidak valid",
    url:          "Url tidak valid",
    number:       "Nomor tidak valid",
    integer:      "Integer tidak valid",
    digits:       "Input harus berupa digit",
    alphanum:     "Input harus berupa alphanumeric"
  },
  notblank:       "Kolom ini harus diisi",
  required:       "Kolom ini harus diisi",
  pattern:        "Input tidak valid",
  min:            "harus lebih besar atau sama dengan %s.",
  max:            "harus lebih kecil atau sama dengan %s.",
  range:          "harus dalam rentang %s dan %s.",
  minlength:      "Input Terlalu pendek, minimal %s karakter atau lebih.",
  maxlength:      "Input terlalu panjang, maksimal %s karakter atau kurang.",
  length:         "Panjang karakter harus dalam rentang %s dan %s",
  mincheck:       "Pilih minimal %s pilihan",
  maxcheck:       "Pilih maksimal %s pilihan",
  check:          "Pilih antar %s dan %s pilihan",
  equalto:        "Input harus sama"
});

Parsley.setLocale('id');

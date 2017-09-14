// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('et', {
  defaultMessage: "See väärtus ei sobi.",
  type: {
    email: "See väärtus peab olema kehtiv email.",
    url: "See väärtus peab olema kehtiv link.",
    number: "See väärtus peab olema number.",
    integer: "See väärtus peab olema täisarv.",
    digits: "See väärtus peab olema number.",
    alphanum: "See väärtus peab olema täht või number."
  },
  notblank: "See väärtus ei tohi olla tühi.",
  required: "See väärtus on nõutud.",
  pattern: "See väärtus ei sobi.",
  min: "See väärtus peab olema suurem või võrdne %s.",
  max: "See väärtus peab olema väiksem või võrdne %s.",
  range: "See väärtus peab olema %s ja %s vahel.",
  minlength: "See väärtus on liiga lühike. Peab olema vähemalt %s tähte.",
  maxlength: "See väärtus ei tohi olla rohkem kui %s tähte.",
  length: "See väärtuse pikkus ei sobi. Peab olema vahemikus %s - %s.",
  mincheck: "Pead valima vähemalt %s valikut.",
  maxcheck: "Maksimaalselt %s valikut.",
  check: "Valik peab olema vahemikus %s ja %s .",
  equalto: "See väärtus peab olema sama."
});

Parsley.setLocale('et');

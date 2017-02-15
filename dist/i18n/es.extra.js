// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('es', {
  dateiso:  "Este valor debe ser una fecha válida (YYYY-MM-DD).",
  minwords: "Este valor es muy corto. Debe tener %s palabras o más.",
  maxwords: "Este valor es muy largo. Debe tener %s palabras o menos.",
  words:    "Este valor es inválido. Debe tener entre %s y %s palabras de longitud.",
  gt:       "Este valor debe ser mayor.",
  gte:      "Este valor debe ser mayor o igual.",
  lt:       "Este valor debe ser menor.",
  lte:      "Este valor debe ser menor o igual.",
  notequalto: "Este valor debe ser diferente."
});

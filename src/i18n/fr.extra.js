// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('fr', {
  dateiso:    "Cette valeur n'est pas une date valide (YYYY-MM-DD).",
  minwords:   "Cette valeur est trop courte. Elle doit contenir au moins %s mots.",
  maxwords:   "Cette valeur est trop longue. Elle doit contenir tout au plus %s mots.",
  words:      "Cette valeur est invalide. Elle doit contenir entre %s et %s mots.",
  gt:         "Cette valeur doit être plus grande.",
  gte:        "Cette valeur doit être plus grande ou égale.",
  lt:         "Cette valeur doit être plus petite.",
  lte:        "Cette valeur doit être plus petite ou égale.",
  notequalto: "Cette valeur doit être différente."
});

// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('en', {
  dateiso:  "This value should be a valid date (YYYY-MM-DD).",
  minwords: "This value is too short. It should have %s words or more.",
  maxwords: "This value is too long. It should have %s words or fewer.",
  words:    "This value length is invalid. It should be between %s and %s words long.",
  gt:       "This value should be greater of %s.",
  gte:      "This value should be greater or equal of %s.",
  lt:       "This value should be less of %s.",
  lte:      "This value should be less or equal of %s.",
  notequalto: "This value should be different of %s."
});

// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('en', {
  dateiso:  "This value should be a valid date (YYYY-MM-DD).",
  date: "It must be a valid date with format %s",
  datebeforenow: "Date must be valid with format %s and be before now",
  dateafternow: "Date must be valid with format %s and be after now",
  minwords: "This value is too short. It should have %s words or more.",
  maxwords: "This value is too long. It should have %s words or fewer.",
  words:    "This value length is invalid. It should be between %s and %s words long.",
  gt:       "This value should be greater than %s.",
  gte:      "This value should be greater or equal to %s.",
  lt:       "This value should be less than %s.",
  lte:      "This value should be less or equal to %s.",
  notequalto: "This value should be different from %s."
});

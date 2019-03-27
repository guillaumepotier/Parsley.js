// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('it', {
  dateiso: "Inserire una data valida (AAAA-MM-GG).",
  date: "Deve essere una data valida nel formato %s",
  datebeforenow: "La data deve precedere la data attuale",
  dateafternow: "La data deve esse posteriore alla data attuale",
});

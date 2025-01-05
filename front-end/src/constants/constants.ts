import { Gender, ProfilData } from "../types";

export const DEFAULT_FORM_VALUES: ProfilData = {
  firstName: "",
  description: "",
  email: "",
  birthday: new Date(),
  gender: Gender.Undisclosed,
  images: [],
  interestedBy: [],
};

export const GENDER_OPTIONS = [
  { value: Gender.Male, label: "Homme" },
  { value: Gender.Female, label: "Femme" },
  { value: Gender.NonBinary, label: "Non binaire" },
  { value: Gender.Other, label: "Autre" },
  { value: Gender.Undisclosed, label: "Non déclaré" },
] as const;

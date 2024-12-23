import { Gender } from "@/types";
import { z } from "zod";

const profilSchema = z.object({
  firstName: z.string().min(2, {
    message: "Le prénom doit avoir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Adresse email invalide.",
  }),
  gender: z.nativeEnum(Gender),
  birthday: z
    .date({
      required_error: "Veuillez sélectionner une date de naissance valide.",
    })
    .refine((date) => date <= new Date(), {
      message: "La date de naissance doit être dans le passé.",
    }),
  images: z
    .array(
      z.union([
        z.instanceof(File),
        z.string(), // Pour gérer les URLs des images existantes
      ])
    )
    .default([]), // Tableau vide par défaut
  interestedBy: z.array(z.nativeEnum(Gender)).default([]),
});

export default profilSchema;

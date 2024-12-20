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
  image: z.instanceof(File).optional(),
  interestedBy: z.array(z.nativeEnum(Gender)).default([]),
});

export default profilSchema;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAccount } from "wagmi";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { pulseContract } from "@/contracts/pulse.contract";
import { useContract } from "@/hooks/useContract";

import ImageCropUploader from "../utils/ImageCropUploaderProps";
import { FancyMultiSelect } from "../utils/FancySelect";
import { DatePicker } from "../utils/DatePicker";
import { useUser } from "@/contexts/user-context";
import { Gender, SBTMetaData } from "@/types";

// Utilitaire pour calculer l'âge en respectant les contraintes int8 de Solidity
const calculateSafeAge = (birthday: Date): number => {
  const today = new Date();
  const calculatedAge =
    today.getFullYear() -
    birthday.getFullYear() -
    (today.getMonth() > birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() && today.getDate() >= birthday.getDate())
      ? 0
      : 1);

  // Limiter l'âge entre 0 et 127 (contraintes int8)
  return Math.min(Math.max(calculatedAge, 0), 127);
};

// Schéma de validation Zod
const formSchema = z.object({
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

// Type pour les données de formulaire
type FormData = z.infer<typeof formSchema>;

export function CreateAccount() {
  const { setIsAccountCreated } = useUser();
  const { address } = useAccount();
  //const router = useRouter();

  // État pour stocker les métadonnées du compte
  const [sbtMetaData, setSbtMetaData] = useState<SBTMetaData>({
    id: BigInt(0),
    firstName: "",
    email: "",
    age: 0,
    gender: Gender.Male,
    interestedBy: [],
    localisation: "",
    hobbies: [],
    note: 0,
    ipfsHashs: [],
    issuedAt: Date.now(),
    issuer: address || "0x0",
  });

  // Hook de contrat personnalisé
  const { writeContract } = useContract(() => {
    setIsAccountCreated(true);
  });

  // Configuration du formulaire
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
      birthday: new Date(),
      gender: Gender.Male,
      interestedBy: [],
      image: undefined,
    },
  });

  // Gestion du téléchargement d'image
  const handleImageCropped = (croppedFile: File) => {
    form.setValue("image", croppedFile);
  };

  // Convertir un genre en nombre
  const convertGenderToNumber = (gender: Gender): number => {
    return gender;
  };

  // Préparer les données du compte
  const prepareAccountData = (formData: FormData): SBTMetaData => {
    console.log("prepareAccountData", formData);
    return {
      id: BigInt(0),
      firstName: formData.firstName,
      email: formData.email,
      age: calculateSafeAge(formData.birthday),
      gender: formData.gender,
      interestedBy: formData.interestedBy,
      localisation: "",
      hobbies: [],
      note: 0,
      ipfsHashs: [],
      issuedAt: Date.now(),
      issuer: address || "0x0",
    };
  };

  // Créer le compte
  const createAccount = async (sbtData: SBTMetaData) => {
    if (!address) return;

    try {
      // Mettre à jour l'état local
      setSbtMetaData(sbtData);

      // Conversion précise pour le contrat
      const contractData = {
        id: BigInt(sbtData.id),
        firstName: sbtData.firstName,
        email: sbtData.email,
        age: Number(sbtData.age),
        gender: convertGenderToNumber(sbtData.gender),
        interestedBy: sbtData.interestedBy.map(convertGenderToNumber),
        localisation: sbtData.localisation,
        hobbies: sbtData.hobbies as readonly string[],
        note: BigInt(sbtData.note),
        ipfsHashs: sbtData.ipfsHashs as readonly string[],
        issuedAt: BigInt(sbtData.issuedAt),
        issuer: sbtData.issuer as `0x${string}`,
      };

      console.log(sbtData);
      // Écrire dans le contrat
      writeContract({
        ...pulseContract,
        functionName: "createAccount",
        args: [address, contractData],
      });
    } catch (error) {
      console.error("Échec de la création du compte :", error);
    }
  };

  return (
    <>
      <div className="flex items-center mb-5">
        <div className="flex-grow border-t border-gray-300"></div>
        <div className="flex-shrink-0 mx-4">
          <h1 className="text-xl text-center">Création du profil</h1>
          {/* 
          <svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z"
              clip-rule="evenodd"
            />
          </svg> */}
        </div>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            //console.log(data);
            const completeData = prepareAccountData(data);
            createAccount(completeData);
          })}
          className="space-y-4"
        >
          {/* Champ Prénom */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@exemple.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ Date de naissance */}
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de naissance</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ Genre */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Gender.Male.toString()}>Homme</SelectItem>
                    <SelectItem value={Gender.Female.toString()}>Femme</SelectItem>
                    <SelectItem value={Gender.NonBinary.toString()}>Non binaire</SelectItem>
                    <SelectItem value={Gender.Other.toString()}>Autre</SelectItem>
                    <SelectItem value={Gender.Undisclosed.toString()}>Non déclaré</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ Intérêts */}
          <FormField
            control={form.control}
            name="interestedBy"
            render={({ field }) => {
              // Ajouter un console.log pour afficher les valeurs de field
              console.log(field); // Affiche toutes les propriétés de field (par exemple, value, onChange, etc.)

              return (
                <FormItem>
                  <FormLabel>Intéressé(e) par</FormLabel>
                  <FormControl>
                    <FancyMultiSelect value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Champ Image de profil */}
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Photo de profil</FormLabel>
                <FormControl>
                  <ImageCropUploader
                    aspectRatio={1}
                    minWidth={100}
                    minHeight={100}
                    maxSize={5}
                    onImageCropped={handleImageCropped}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bouton de soumission */}
          <div className="flex justify-center pt-2">
            <Button type="submit">Créer mon compte</Button>
          </div>
        </form>
      </Form>
    </>
  );
}

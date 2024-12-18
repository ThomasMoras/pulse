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
import { SBTMetaData, Gender } from "@/type/data_type";

import ImageCropUploader from "../utils/ImageCropUploaderProps";
import { FancyMultiSelect } from "../utils/FancySelect";
import { DatePicker } from "../utils/DatePicker";
import { useUser } from "@/contexts/user-context";

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
  interestedBy: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .default([]),
});

// Type pour les données de formulaire
type FormData = z.infer<typeof formSchema>;

export function CreateAccount() {
  const { setIsAccountCreated } = useUser();
  const { address } = useAccount();
  //const router = useRouter();

  // État pour stocker les métadonnées du compte
  const [sbtMetaData, setSbtMetaData] = useState<SBTMetaData>({
    id: 0,
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
    return {
      id: 0,
      firstName: formData.firstName,
      email: formData.email,
      age: calculateSafeAge(formData.birthday),
      gender: formData.gender,
      interestedBy: formData.interestedBy.map(
        (interest) => Gender[interest.value as keyof typeof Gender]
      ),
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intéressé(e) par</FormLabel>
              <FormControl>
                <FancyMultiSelect value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
  );
}

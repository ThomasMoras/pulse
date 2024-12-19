"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";

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
import { Gender, SBTMetaData } from "@/types";
import { useRouter } from "next/navigation";
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

type FormData = z.infer<typeof formSchema>;

const calculateSafeAge = (birthday: Date): number => {
  const today = new Date();
  const calculatedAge =
    today.getFullYear() -
    birthday.getFullYear() -
    (today.getMonth() > birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() && today.getDate() >= birthday.getDate())
      ? 0
      : 1);

  return Math.min(Math.max(calculatedAge, 0), 127);
};

export function EditProfile() {
  const router = useRouter();
  const { address } = useAccount();
  const [sbtMetaData, setSbtMetaData] = useState<SBTMetaData>();
  const [isLoading, setIsLoading] = useState(true);

  const handleBack = () => {
    console.log("retour !!");
    router.push("/");
  };

  // Lecture du profil utilisateur
  const { data: userProfil } = useReadContract({
    abi: pulseContract.abi,
    address: pulseContract.address,
    functionName: "getAccount",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
      birthday: new Date(),
      gender: Gender.Undisclosed,
      interestedBy: [],
    },
  });

  // Mise à jour des données du profil
  useEffect(() => {
    console.log(userProfil);
    if (userProfil) {
      setSbtMetaData(userProfil);
      setIsLoading(false);
    }
  }, [userProfil]);

  // Mise à jour du formulaire quand les données sont chargées
  useEffect(() => {
    if (sbtMetaData) {
      form.reset({
        firstName: sbtMetaData.firstName,
        email: sbtMetaData.email,
        birthday: new Date(Date.now() - sbtMetaData.age * 365 * 24 * 60 * 60 * 1000),
        gender: sbtMetaData.gender,
        interestedBy: sbtMetaData.interestedBy.map((gender) => ({
          value: Gender[gender].toString(),
          label: Gender[gender],
        })),
      });
    }
  }, [sbtMetaData, form]);

  const handleImageCropped = (croppedFile: File) => {
    form.setValue("image", croppedFile);
  };

  const convertGenderToNumber = (gender: Gender): number => {
    return gender;
  };

  const { writeContract } = useContract(() => {
    // Callback après mise à jour réussie
  });

  const prepareAccountData = (formData: FormData): SBTMetaData => {
    if (!sbtMetaData) {
      throw new Error("Données du profil non chargées");
    }

    return {
      ...sbtMetaData,
      firstName: formData.firstName,
      email: formData.email,
      age: calculateSafeAge(formData.birthday),
      gender: formData.gender,
      interestedBy: formData.interestedBy.map(
        (interest) => Gender[interest.value as keyof typeof Gender]
      ),
      issuedAt: Date.now(),
    };
  };

  const updateAccount = async (sbtData: SBTMetaData) => {
    if (!address) return;

    try {
      setSbtMetaData(sbtData);

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

      writeContract({
        ...pulseContract,
        functionName: "updateAccount",
        args: [address, contractData],
      });
    } catch (error) {
      console.error("Échec de la mise à jour du compte :", error);
    }
  };

  if (isLoading) {
    return <div>Chargement du profil...</div>;
  }

  return (
    <>
      <div className="flex items-center mb-5">
        <div className="flex-grow border-t border-gray-300"></div>
        <div className="flex-shrink-0 mx-4">
          <h1 className="text-xl text-center">Modifier le profil</h1>
        </div>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            const completeData = prepareAccountData(data);
            updateAccount(completeData);
          })}
          className="space-y-4"
        >
          {/* Les champs de formulaire restent identiques */}
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
          <div className="flex justify-center items-center pt-2 space-x-2">
            <Button className="bg-rose-400 hover:bg-rose-600" type="submit">
              Mettre à jour mon profil
            </Button>
            <Button className="bg-gray-400 hover:bg-gray-600" type="button" onClick={handleBack}>
              Retour
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { writeContract } from "viem/actions";
import { useContract } from "@/hooks/useContract";
import { useContext, useState } from "react";
import { DataContext } from "@/contexts/data-provider";
import { useAccount } from "wagmi";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import ImageCropUploader from "./ImageCropUploaderProps";
import { SBTMetaData } from "@/type/data_type";
import { Gender } from "@/type/data_type";
import { FancyMultiSelect } from "./FancySelect";
import DatetimePicker, { DatePicker } from "./DatePicker";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  gender: z.enum(["MALE", "FEMALE", "NON_BINARY", "OTHER", "UNDISCLOSED"], {
    required_error: "Veuillez sélectionner un genre",
  }),
  // birthday: z.date({
  //   required_error: "Please select a date and time",
  //   invalid_type_error: "That's not a date!",
  // }),
  birthday: z
    .date({
      required_error: "Veuillez sélectionner une date valide.",
    })
    .refine((date) => date <= new Date(), {
      message: "La date doit être dans le passé.",
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

export function Profil({ firstConnection }: { firstConnection: boolean }) {
  const { address } = useAccount();
  const { data, refetchBalance } = useContext(DataContext);
  const { isConnected, isPending, writeContract } = useContract(() => {
    refetchBalance();
    //setDepositAmount("");
  });

  const [sbtMetaData, setSbtMetaData] = useState<SBTMetaData>({
    id: 1,
    firstName: "",
    email: "",
    age: 0,
    gender: Gender.Male,
    localisation: "",
    hobbies: [],
    note: 0,
    ipfsHashs: [],
    issuedAt: Date.now(),
    issuer: "0xYourIssuerAddress",
    interestedBy: [],
  });

  // Fonction pour envoyer les données, y compris l'image téléchargée et les autres informations
  const createAccount = async (data: {
    firstName: string;
    email: string;
    gender: "MALE" | "FEMALE" | "NON_BINARY" | "OTHER" | "UNDISCLOSED";
    birthday: Date;
    image?: File;
    age: number;
    localisation: string;
    hobbies: string[];
    note: number;
    ipfsHashs: string[];
  }) => {
    if (address !== undefined && address !== null) {
      // Mappage du genre pour le convertir en nombre
      const genderMap = {
        MALE: 0,
        FEMALE: 1,
        NON_BINARY: 2,
        OTHER: 3,
        UNDISCLOSED: 4,
      };
      const genderNumber = genderMap[data.gender];

      const imageUrl = data.image ? URL.createObjectURL(data.image) : "";
      const today = new Date();
      const age =
        today.getFullYear() -
        data.birthday.getFullYear() -
        (today.getMonth() > data.birthday.getMonth() ||
        (today.getMonth() === data.birthday.getMonth() &&
          today.getDate() >= data.birthday.getDate())
          ? 0
          : 1);

      // Préparation des données sous forme de structure SBTMetaData
      const sbtMetaData = {
        firstName: data.firstName,
        email: data.email,
        age: data.age,
        gender: genderNumber,
        localisation: data.localisation,
        hobbies: data.hobbies,
        note: data.note,
        ipfsHashs: data.ipfsHashs,
        issuedAt: Date.now(), // Date de création
        issuer: address, // Adresse de l'émetteur (peut être l'utilisateur connecté)
      };

      writeContract({
        ...pulseContract,
        functionName: "createAccount",
        args: [
          address,
          {
            ...sbtMetaData,
            id: BigInt(0), // Assuming id is required but not provided in the original code
            note: BigInt(sbtMetaData.note),
            issuedAt: BigInt(sbtMetaData.issuedAt),
            hobbies: sbtMetaData.hobbies as readonly string[],
            ipfsHashs: sbtMetaData.ipfsHashs as readonly string[],
          },
        ],
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
      gender: "MALE",
      birthday: new Date(),
      image: undefined,
      interestedBy: [],
    },
  });

  // Fonction pour gérer l'image recadrée
  const handleImageCropped = (croppedFile: File) => {
    form.setValue("image", croppedFile); // Mettre à jour la valeur de l'image dans le formulaire
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          const completeData = {
            ...data,
            firstName: data.firstName, // Assuming username is the first name for simplicity
            age: 0, // Placeholder value, should be replaced with actual age logic
            localisation: "", // Placeholder value, should be replaced with actual localisation logic
            hobbies: [], // Placeholder value, should be replaced with actual hobbies logic
            note: 0, // Placeholder value, should be replaced with actual note logic
            ipfsHashs: [], // Placeholder value, should be replaced with actual ipfsHashs logic
          };
          console.log(
            "Données complètes prêtes à être envoyées :",
            completeData
          );

          createAccount(completeData);
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
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
                <Input placeholder="vitalik.buterin@gmail.com" {...field} />
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
              <FormLabel>Anniversaire</FormLabel>
              <FormControl>
                <div
                  // onClick={() => console.log("Valeur actuelle :", field.value)}
                  className="w-full"
                >
                  <DatePicker
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date); // Met à jour la valeur du formulaire
                      setTimeout(() => {
                        console.log("Valeur mise à jour :", date); // Affiche immédiatement la nouvelle valeur
                      }, 0); // Permet à React de propager les changements
                    }}
                    placeholder="Choisir une date"
                    className="w-full"
                  />
                </div>
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre genre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MALE">Homme</SelectItem>
                  <SelectItem value="FEMALE">Femme</SelectItem>
                  <SelectItem value="NON_BINARY">Non binaire</SelectItem>
                  <SelectItem value="OTHER">Autre</SelectItem>
                  <SelectItem value="UNDISCLOSED">Non déclaré</SelectItem>
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
                <FancyMultiSelect
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Intégration du composant ImageCropUploader */}
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Photos de profil</FormLabel>
              <FormControl>
                <ImageCropUploader
                  aspectRatio={1}
                  minWidth={100}
                  minHeight={100}
                  maxSize={5}
                  onImageCropped={handleImageCropped} // Met à jour l'image recadrée dans le formulaire
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center pt-2">
          <Button type="submit">
            {firstConnection ? "Création du compte" : "Mise à jour"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

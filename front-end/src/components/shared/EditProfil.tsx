"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "wagmi";

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

import { FancyMultiSelect } from "../utils/FancySelect";
import { DatePicker } from "../utils/DatePicker";
import ImageCropUploader from "../utils/ImageCropUploaderProps";
import { Gender, ProfilData } from "@/types";
import profilSchema from "@/lib/schemas/profil";
import { DEFAULT_FORM_VALUES, GENDER_OPTIONS } from "@/constants/constants";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileUpdate } from "@/hooks/useProfileUpdate";
import { useRouter } from "next/navigation";
import { EnumSelect } from "../ui/custom/enum-select";

export function EditProfile() {
  const router = useRouter();
  const { address } = useAccount();
  const { isLoading, data: profile, error } = useProfileData(address);
  const { updateProfile } = useProfileUpdate();

  const form = useForm<ProfilData>({
    resolver: zodResolver(profilSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (!profile) return;

    console.log("Raw profile:", profile);

    const genderValue = profile.gender as Gender;
    console.log("Gender value from profile:", {
      genderValue,
      isValidGender: Object.values(Gender).includes(genderValue),
    });

    if (!Object.values(Gender).includes(genderValue)) {
      console.error("Invalid gender value:", genderValue);
      return;
    }

    const resetData = {
      firstName: profile.firstName,
      email: profile.email,
      birthday: new Date(Date.now() - profile.age * 365 * 24 * 60 * 60 * 1000),
      gender: genderValue,
      interestedBy: profile.interestedBy,
    };

    console.log("Form reset data:", resetData);
    form.reset(resetData);

    // Vérification après reset
    console.log("Form values after reset:", form.getValues());
  }, [profile, form]);

  if (error) {
    return <div className="text-center p-4 text-red-500">Erreur lors du chargement du profil</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">Chargement du profil...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-8">
        <div className="flex-grow border-t border-gray-300" />
        <h1 className="px-4 text-2xl font-semibold">Modifier le profil</h1>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (formData) => {
            if (!address || !profile) return;
            await updateProfile(address, formData, profile);
          })}
          className="space-y-6"
        >
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
                  <Input placeholder="email@exemple.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de naissance</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => {
              console.log("FormField gender rendering:", {
                fieldValue: field.value,
                fieldValueType: typeof field.value,
                formValues: form.getValues(),
              });
              return (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <EnumSelect<Gender>
                      value={field.value}
                      onChange={(newValue) => {
                        console.log("Gender changing to:", newValue);
                        field.onChange(newValue);
                      }}
                      options={GENDER_OPTIONS}
                      placeholder="Sélectionnez votre genre"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo de profil</FormLabel>
                <FormControl>
                  <ImageCropUploader
                    aspectRatio={1}
                    minWidth={100}
                    minHeight={100}
                    maxSize={5}
                    onImageCropped={(file) => field.onChange(file)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center gap-4 pt-6">
            <Button type="submit" className="bg-rose-400 hover:bg-rose-600">
              Mettre à jour mon profil
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/")}
              className="bg-gray-400 hover:bg-gray-600"
            >
              Retour
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

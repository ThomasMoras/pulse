"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "wagmi";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { FancyMultiSelect } from "../utils/FancySelect";
import { DatePicker } from "../utils/DatePicker";
import ImageCropUploader from "../utils/ImageCropUploaderProps";
import { Gender, ProfilData } from "../../types";
import profilSchema from "@/utils/schemas/profil";
import { DEFAULT_FORM_VALUES, GENDER_OPTIONS } from "@/constants/constants";
import { useProfileData } from "../../hooks/useProfileData";
import { useProfileUpdate } from "../../hooks/useProfileUpdate";
import { useRouter } from "next/navigation";
import { EnumSelect } from "../ui/custom/enum-select";
import { formatBirthDate } from "../../utils/date.utils";
import { usePinata } from "../../hooks/usePinata";
import { Textarea } from "../ui/textarea";

export function EditProfile() {
  const router = useRouter();
  const { address } = useAccount();
  const { isLoading, data: profile, error } = useProfileData(address);
  const { updateProfile } = useProfileUpdate();
  const { uploadFiles } = usePinata();
  const ipfsToHttps = (hash: string) => `https://gateway.pinata.cloud/ipfs/${hash}`;

  const form = useForm<ProfilData>({
    resolver: zodResolver(profilSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (!profile) return;
    const genderValue = profile.gender as Gender;
    if (!Object.values(Gender).includes(genderValue)) {
      console.error("Invalid gender value:", genderValue);
      return;
    }
    const resetData = {
      firstName: profile.firstName,
      description: profile.description,
      email: profile.email,
      birthday: formatBirthDate(Number(profile.birthday)),
      gender: genderValue,
      images: profile.ipfsHashs.map((hash) => ipfsToHttps(hash)),
      interestedBy: profile.interestedBy,
    };
    form.reset(resetData);
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

            const updatedFormData = { ...formData };
            if (formData.images?.length) {
              try {
                const ipfsHashes = formData.images
                  .filter((file) => typeof file === "string")
                  .map((url) => {
                    const hashMatch = url.match(/ipfs\/(.+)$/);
                    return hashMatch ? hashMatch[1] : "";
                  })
                  .filter((hash) => hash !== "");

                const newFiles = formData.images.filter((file) => file instanceof File);
                const obj = { address: `0x${address}`, type: "profile_images" };
                const stringValue = JSON.stringify(obj);
                const results = await uploadFiles(newFiles as File[], stringValue);
                updatedFormData.images = [
                  ...ipfsHashes,
                  ...results.map((result) => result.ipfsHash),
                ];
                // Mettre à jour le formulaire avec les URLs des images
              } catch (error) {
                console.error("Upload failed:", error);
                // Gérer l'erreur
              }
            }
            await updateProfile(address, updatedFormData, profile);
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Votre description" {...field} />
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
              // console.log("FormField gender rendering:", {
              //   fieldValue: field.value,
              //   fieldValueType: typeof field.value,
              //   formValues: form.getValues(),
              // });
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photos</FormLabel>
                <FormControl>
                  <ImageCropUploader
                    aspectRatio={1}
                    minWidth={100}
                    minHeight={100}
                    existingImages={profile?.ipfsHashs?.map((hash) => ipfsToHttps(hash)) || []}
                    maxSize={5}
                    onImageCropped={(files) => {
                      // Met à jour le champ sans déclencher de soumission
                      field.onChange({
                        target: {
                          value: files,
                        },
                        type: "change",
                      });
                    }}
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
              onClick={() => {
                router.replace("/");
              }}
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

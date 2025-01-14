"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import ImageCropUploader from "../utils/ImageCropUploaderProps";
import { FancyMultiSelect } from "../utils/FancySelect";
import { DatePicker } from "../utils/DatePicker";
import { Gender, ProfilData } from "../../types";
import { useRouter } from "next/navigation";
import { useProfileData } from "../../hooks/useProfileData";
import profilSchema from "../../utils/schemas/profil";
import { useProfileCreate } from "../../hooks/useProfileCreate";
import { EnumSelect } from "../ui/custom/enum-select";
import { usePinata } from "../../hooks/usePinata";
import { Textarea } from "../ui/textarea";
import { DEFAULT_FORM_VALUES, GENDER_OPTIONS } from "../../constants/constants";

export function CreateAccount() {
  const router = useRouter();
  const { address } = useAccount();
  const { uploadFiles } = usePinata();
  const { isLoading, data: profile, error } = useProfileData(address);
  const { createProfile } = useProfileCreate();
  const ipfsToHttps = (hash: string) => `https://gateway.pinata.cloud/ipfs/${hash}`;

  const form = useForm<ProfilData>({
    resolver: zodResolver(profilSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  if (error) {
    return <div className="text-center p-4 text-red-500">Erreur...</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">Chargement...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-8">
        <div className="flex-grow border-t border-gray-300" />
        <h1 className="px-4 text-2xl font-semibold">Création du compte</h1>
        <div className="flex-grow border-t border-gray-300" />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (formData) => {
            if (!address) return;

            try {
              const updatedFormData = { ...formData };

              if (formData.images?.length) {
                const obj = { address: `0x${address}`, type: "profile_images" };
                const stringValue = JSON.stringify(obj);
                const results = await uploadFiles(formData.images as File[], stringValue);
                updatedFormData.images = results.map((result) => result.ipfsHash);
              }

              await createProfile(address, updatedFormData, profile);
            } catch (error) {
              console.error("Erreur lors de la création du profil:", error);
            }
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
              return (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <EnumSelect<Gender>
                      value={field.value}
                      onChange={(newValue) => {
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
                      field.onChange(files);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center gap-4 pt-6">
            <Button type="submit" className="bg-rose-400 hover:bg-rose-600">
              Création du compte
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

import { pulseContract } from "@/contracts/pulse.contract";
import { ProfilData, SBTMetaData } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useContract } from "./useContract";
import { dateToTimestamp } from "@/utils/date.utils";

export function useProfileUpdate() {
  const router = useRouter();

  const { writeContract } = useContract(() => {
    // Callback exécuté après la signature et la confirmation de la transaction
    router.push("/");
  });

  const updateProfile = useCallback(
    async (address: string, formData: ProfilData, currentProfile: SBTMetaData) => {
      try {
        const updatedData = {
          ...currentProfile,
          firstName: formData.firstName,
          email: formData.email,
          birthday: formData.birthday,
          gender: formData.gender,
          ipfsHashs: [...formData.images],
          interestedBy: formData.interestedBy,
          issuedAt: Date.now(),
        };
        console.log(updatedData);

        const contractData = {
          firstName: updatedData.firstName,
          email: updatedData.email,
          birthday: dateToTimestamp(updatedData.birthday),
          gender: updatedData.gender,
          interestedBy: updatedData.interestedBy,
          localisation: updatedData.localisation,
          hobbies: updatedData.hobbies as readonly string[],
          note: BigInt(updatedData.note),
          ipfsHashs: updatedData.ipfsHashs as readonly string[],
          issuedAt: BigInt(updatedData.issuedAt),
          issuer: updatedData.issuer as `0x${string}`,
        };

        await writeContract({
          ...pulseContract,
          functionName: "updateAccount",
          args: [address, contractData],
        });

        return { success: true };
      } catch (error) {
        console.error("Échec de la mise à jour du compte :", error);
        return { success: false, error };
      }
    },
    [writeContract]
  );

  return { updateProfile };
}

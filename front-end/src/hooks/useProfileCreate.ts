import { pulseContract } from "@/contracts/pulse.contract";
import { ProfilData, SBTMetaData } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useContract } from "./useContract";
import { dateToTimestamp } from "@/lib/date/date-operations";
import { useUser } from "@/contexts/user-context";

export function useProfileCreate() {
  const { setIsAccountCreated } = useUser();

  const router = useRouter();

  const { writeContract } = useContract(() => {
    // Callback exécuté après la signature et la confirmation de la transaction
    setIsAccountCreated(true);
    router.push("/");
  });

  const createProfile = useCallback(
    async (address: string, formData: ProfilData, currentProfile: SBTMetaData) => {
      try {
        const updatedData = {
          ...currentProfile,
          firstName: formData.firstName,
          email: formData.email,
          birthday: formData.birthday,
          gender: formData.gender,
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
          functionName: "createAccount",
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

  return { createProfile };
}

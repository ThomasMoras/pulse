import { pulseContract } from "@/contracts/pulse.contract";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useReadContract } from "wagmi";
import { FormField } from "../ui/form";
import { FormDescription, FormLabel, FormMessage } from "../ui/form";
import { FormControl } from "../ui/form";
import { FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Profil } from "./Profil";

const Connected = () => {
  const { isConnected, address } = useAccount();

  const [isUserHasSBT, setUserHasSBT] = useState();

  // check if user has mint his SBT
  const {
    data: hasSBT,
    error,
    isPending,
    refetch,
  } = useReadContract({
    abi: pulseContract.abi,
    address: pulseContract.address,
    functionName: "hasSoulBoundToken",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address, // Ne lance la requête que si une adresse est connectée
    },
  });

  useEffect(() => {
    if (hasSBT !== undefined) {
    }
  }, [hasSBT]); // Ajouter hasSBT comme dépendance
  return (
    <div className="flex justify-center items-center">
      {!hasSBT && (
        <div className="w-1/3">
          <Profil firstConnection={true} />
        </div>
      )}
      {hasSBT && (
        <div className="w-1/3">
          <p>Vous avez déjà votre SBT.</p>
        </div>
      )}
    </div>
  );
};

export default Connected;

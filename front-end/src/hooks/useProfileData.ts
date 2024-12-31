import { pulseContract } from "@/contracts/pulse.contract";
import { SBTMetaData } from "@/types";
import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";

interface ProfileState {
  isLoading: boolean;
  data: SBTMetaData | null;
  error: Error | null;
}

export function useProfileData(address: string | undefined) {
  const [state, setState] = useState<ProfileState>({
    isLoading: true,
    data: null,
    error: null,
  });

  const { data: userProfil } = useReadContract({
    abi: pulseContract.abi,
    address: pulseContract.address,
    functionName: "getAccount",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    //if (!userProfil) return;
    try {
      const typedUserProfil = userProfil as unknown as SBTMetaData;
      setState({
        isLoading: false,
        data: typedUserProfil,
        error: null,
      });
    } catch (error) {
      setState({
        isLoading: false,
        data: null,
        error: error as Error,
      });
    }
  }, [userProfil]);

  return state;
}

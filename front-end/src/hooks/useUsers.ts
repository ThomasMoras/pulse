import { useState, useCallback, useEffect } from "react";
import { pulseContract } from "@/contracts/pulse.contract";
import { Gender } from "@/types";
import { useReadContract } from "wagmi";

interface UseUsersParams {
  filters: {
    minAge: number;
    maxAge: number;
    gender: Gender;
  };
}

export function useUsers({ filters }: UseUsersParams) {
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const BATCH_SIZE = 10;

  const {
    data: rawBatch,
    isError,
    isLoading,
    refetch: refetchContract,
  } = useReadContract({
    address: pulseContract.address,
    abi: pulseContract.abi,
    functionName: "getBatchOfUsers",
    args: [BigInt(BATCH_SIZE), BigInt(currentPage * BATCH_SIZE), filters],
    enabled: true,
  });

  // Traitement des données du contrat
  useEffect(() => {
    if (!rawBatch) return;

    console.log(rawBatch);
    try {
      const [newUsers, count] = rawBatch as [any[], bigint];
      const cleanUsers = newUsers.filter(
        (user) => user.firstName !== "" && user.email !== "" && user.birthday !== 0n
      );

      setUsers(cleanUsers);
      setHasMore(cleanUsers.length === BATCH_SIZE);
    } catch (error) {
      console.error("Error processing users:", error);
    }
  }, [rawBatch]);

  // Chargement de plus de profils
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setCurrentPage((prev) => prev + 1);
  }, [isLoading, hasMore]);

  // Fonction de refetch
  const refetch = useCallback(async () => {
    setCurrentPage(0);
    try {
      const result = await refetchContract();
      return result;
    } catch (error) {
      console.error("Error refetching:", error);
      return null;
    }
  }, [refetchContract]);

  // Montage initial
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Reset des filtres
  const resetFilters = useCallback(() => {
    setUsers([]);
    setCurrentPage(0);
    setHasMore(true);
    refetch();
  }, [refetch]);

  return {
    users,
    loading: isLoading,
    error: isError,
    hasMore,
    loadMore,
    refetch,
    resetFilters,
  };
}

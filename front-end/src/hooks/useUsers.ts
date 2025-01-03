import { useState, useCallback, useEffect } from "react";
import { pulseContract } from "@/contracts/pulse.contract";
import { Gender } from "@/types";
import { useAccount, useReadContract } from "wagmi";
import { User } from "@/types/swiper.types";

interface UseUsersParams {
  filters: {
    minAge: number;
    maxAge: number;
    gender: Gender;
  };
}

export function useUsers({ filters }: UseUsersParams) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { address } = useAccount();
  const BATCH_SIZE = 10;

  // Récupération du batch d'utilisateurs
  const {
    data: rawBatch,
    isError,
    isLoading,
    refetch: refetchContract,
  } = useReadContract({
    address: pulseContract.address,
    abi: pulseContract.abi,
    functionName: "getBatchOfUsers",
    args: [BigInt(BATCH_SIZE), BigInt(currentPage * BATCH_SIZE), filters, address],
    enabled: !!address,
  });

  // Traitement des données
  useEffect(() => {
    if (!rawBatch) {
      return;
    }

    try {
      const [newUsers, count] = rawBatch as [any[], bigint];
      const validUsers = newUsers.filter((user) => {
        const isValid = user.firstName !== "" && user.email !== "" && user.birthday !== 0n;
        return isValid;
      });

      setUsers(validUsers);
      setHasMore(validUsers.length === BATCH_SIZE);
    } catch (error) {
      console.error("❌ Error processing users:", error);
    }
  }, [rawBatch]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setCurrentPage((prev) => prev + 1);
  }, [isLoading, hasMore]);

  const refetch = useCallback(async () => {
    setCurrentPage(0);
    try {
      const result = await refetchContract();
      console.log("🔄 Refetch result:", result);
      return result;
    } catch (error) {
      console.error("❌ Error refetching:", error);
      return null;
    }
  }, [refetchContract]);

  useEffect(() => {
    if (address) {
      refetch();
    }
  }, [address, refetch]);

  const resetFilters = useCallback(() => {
    setUsers([]);
    setCurrentPage(0);
    setHasMore(true);
    refetch();
  }, [refetch]);

  const removeUser = useCallback((addressToRemove: string) => {
    setUsers((currentUsers) => currentUsers.filter((user) => user.userAddress !== addressToRemove));
  }, []);

  return {
    users,
    loading: isLoading,
    error: isError,
    hasMore,
    loadMore,
    refetch,
    resetFilters,
    removeUser,
  };
}

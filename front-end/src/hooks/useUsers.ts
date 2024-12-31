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
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const BATCH_SIZE = 10;

  const {
    data: rawBatch,
    isError,
    isLoading,
  } = useReadContract({
    address: pulseContract.address,
    abi: pulseContract.abi,
    functionName: "getBatchOfUsers",
    args: [BigInt(BATCH_SIZE), BigInt(currentPage * BATCH_SIZE), filters],
  });

  // Traitement des données quand rawBatch change
  useEffect(() => {
    console.log("RawBatch changed:", rawBatch);
    if (!rawBatch || loading) return;

    const [newUsers, count] = rawBatch as [any[], bigint];
    const cleanUsers = newUsers.filter(
      (user) => user.firstName !== "" && user.email !== "" && user.birthday !== 0n
    );
    console.log("Clean users:", cleanUsers);

    if (currentPage === 0) {
      setUsers(cleanUsers);
    } else {
      setUsers((prev) => [...prev, ...cleanUsers]);
    }
    setHasMore(cleanUsers.length === BATCH_SIZE);
  }, [rawBatch, currentPage]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setCurrentPage((prev) => prev + 1);
  }, [loading, hasMore]);

  // Reset uniquement lorsque les filtres changent
  const filtersKey = JSON.stringify(filters);
  useEffect(() => {
    console.log("Filters changed, resetting...");
    setUsers([]);
    setCurrentPage(0);
    setHasMore(true);
  }, [filtersKey]);

  return {
    users,
    loading: isLoading,
    error: isError,
    hasMore,
    loadMore,
    resetFilters: useCallback(() => {
      setUsers([]);
      setCurrentPage(0);
      setHasMore(true);
    }, []),
  };
}

import { useState, useCallback, useEffect } from "react";
import { InteractionStatus } from "@/types";
import { ANIMATION_DURATION, SWIPE_THRESHOLD } from "@/types/swiper.types";

interface UseSwipeLogicProps {
  users: any[];
  interact: (address: string, status: InteractionStatus) => void;
  isPending: boolean;
  loadMore: () => void;
  hasMore: boolean;
}

export const useSwipeLogic = ({
  users,
  interact,
  isPending,
  loadMore,
  hasMore,
}: UseSwipeLogicProps) => {
  const [direction, setDirection] = useState<number>(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (hasMore && users?.length && users.length - currentIndex <= 3) {
      loadMore();
    }
  }, [currentIndex, hasMore, loadMore, users?.length]);

  const handleSwipe = useCallback(
    (newDirection: number) => {
      if (!users?.length) return;

      setDirection(newDirection);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % users.length);
        setDirection(0);
      }, ANIMATION_DURATION);
    },
    [users?.length]
  );

  const handleLike = useCallback(
    (userAddress: string) => {
      if (!userAddress || isPending) return;
      interact(userAddress, InteractionStatus.LIKED);
    },
    [interact, isPending]
  );

  const handleDislike = useCallback(
    (userAddress: string) => {
      if (!userAddress || isPending) return;
      interact(userAddress, InteractionStatus.DISLIKED);
    },
    [interact, isPending]
  );

  const handleSuperLike = useCallback(
    (userAddress: string) => {
      if (!userAddress || isPending) return;
      interact(userAddress, InteractionStatus.SUPER_LIKED);
    },
    [interact, isPending]
  );

  const handleDragEnd = useCallback(
    (_, info: any) => {
      if (!users || !users[currentIndex]?.userAddress || isPending) return;

      const dragDistance = info.point.x - dragStart.x;
      if (Math.abs(dragDistance) > SWIPE_THRESHOLD) {
        if (dragDistance < 0) {
          interact(users[currentIndex].userAddress, InteractionStatus.LIKED);
        } else {
          interact(users[currentIndex].userAddress, InteractionStatus.DISLIKED);
        }
      }
    },
    [dragStart.x, interact, isPending, users, currentIndex]
  );

  return {
    direction,
    currentIndex,
    dragStart,
    setDragStart,
    handleSwipe,
    handleLike,
    handleDislike,
    handleSuperLike,
    handleDragEnd,
  };
};

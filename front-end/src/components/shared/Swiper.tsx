"use client";

import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardFooter } from "@/components/ui/card";
import { Heart, ThumbsDown, Star } from "lucide-react";
import { Gender } from "@/types";
import { useUsers } from "@/hooks/useUsers";
import { useInteraction } from "@/hooks/useInteraction";
import { useSwipeLogic } from "@/hooks/useSwipeLogic";
import { cardVariants } from "@/utils/animation";
import { ActionButton } from "../utils/ActionButton";
import { UserProfile } from "../utils/UserProfile";
import { User } from "@/types/swiper.types";
import { useProfileData } from "@/hooks/useProfileData";
import { useAccount } from "wagmi";
import { useMatch } from "@/contexts/matchContext";

const LoadingState = () => (
  <div className="w-full max-w-sm mx-auto flex justify-center items-center h-[580px]">
    <p className="text-gray-500">Chargement des profils...</p>
  </div>
);

const EmptyState = () => (
  <div className="w-full max-w-sm mx-auto flex justify-center items-center h-[580px]">
    <p className="text-gray-500">Aucun profil disponible</p>
  </div>
);

interface SwiperCardProps {
  user: User;
  isPending: boolean;
  onLike: () => void;
  onDislike: () => void;
  onSuperLike: () => void;
}

const SwiperCard: React.FC<SwiperCardProps> = ({
  user,
  isPending,
  onLike,
  onDislike,
  onSuperLike,
}) => (
  <Card className="h-full overflow-hidden">
    <UserProfile user={user} />
    <CardFooter className="flex justify-center gap-6 p-4">
      <ActionButton
        Icon={ThumbsDown}
        onClick={onDislike}
        variant="outline"
        hoverClass="hover:bg-red-50 hover:text-red-500"
      />
      <ActionButton
        Icon={Heart}
        onClick={onLike}
        className={`h-14 w-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 ${
          isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
        iconClass="w-6 h-6"
        disabled={isPending}
      />
      <ActionButton
        Icon={Star}
        onClick={onSuperLike}
        variant="outline"
        hoverClass="hover:bg-green-200 hover:text-green-500"
      />
    </CardFooter>
  </Card>
);

const Swiper: React.FC = () => {
  // Suppression du prop onMatch
  const { address } = useAccount();
  const { isLoading, data: profile, error } = useProfileData(address);
  const { addMatch } = useMatch();

  const filters = useMemo(
    () => ({
      minAge: 1,
      maxAge: 99,
      gender: Gender.Undisclosed,
    }),
    []
  );

  const { users, loading, hasMore, loadMore, refetch, removeUser } = useUsers({ filters });

  const { interact, isPending, logMatchData } = useInteraction((recipient) => {
    removeUser(recipient);
  });

  useEffect(() => {
    if (logMatchData) {
      addMatch(logMatchData);
    }
  }, [logMatchData, addMatch]);

  useEffect(() => {
    if (profile) {
      if (profile.interestedBy.length > 0) filters.gender = profile.interestedBy[0];
    }
  }, [filters, profile]);

  const {
    direction,
    currentIndex,
    setDragStart,
    handleLike,
    handleDislike,
    handleSuperLike,
    handleDragEnd,
  } = useSwipeLogic({
    users,
    interact,
    isPending,
    loadMore,
    hasMore,
  });

  if (loading) return <LoadingState />;
  if (!users || users.length === 0) return <EmptyState />;

  const currentUser = users[currentIndex];

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative h-[580px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragStart={(_, info) => setDragStart({ x: info.point.x, y: info.point.y })}
            onDragEnd={handleDragEnd}
          >
            <SwiperCard
              user={currentUser}
              isPending={isPending}
              onLike={() => handleLike(currentUser.userAddress)}
              onDislike={() => handleDislike(currentUser.userAddress)}
              onSuperLike={() => handleSuperLike(currentUser.userAddress)}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Swiper;

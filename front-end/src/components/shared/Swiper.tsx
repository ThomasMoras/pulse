"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsDown, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Gender } from "@/types";
import { useUsers } from "@/hooks/useUsers";
import { calculateAge } from "@/utils/date.utils";
import { DEFAULT_PROFILE_URL } from "@/types/pinata.types";

const SWIPE_THRESHOLD = 100;
const ANIMATION_DURATION = 500;

const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const ActionButton = ({ Icon, onClick, variant, className, hoverClass, iconClass, href }) => {
  const ButtonContent = (
    <Button
      variant={variant}
      size="icon"
      className={`h-12 w-12 rounded-full transition-colors ${hoverClass} ${className}`}
      onClick={onClick}
    >
      <Icon className={iconClass || "w-5 h-5"} />
    </Button>
  );

  // Si un href est fourni, on enveloppe avec Link
  if (href) {
    return <Link href={href}>{ButtonContent}</Link>;
  }

  return ButtonContent;
};

const UserProfile = ({ user }) => (
  <div className="relative h-[500px]">
    <Image
      src={DEFAULT_PROFILE_URL.concat(user.ipfsHashs[0])}
      alt={`Photo de ${user.firstName}`}
      fill
      className="object-cover"
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 p-6 flex flex-col justify-end">
      <h2 className="text-3xl font-bold text-white mb-2">
        {user.firstName}, {calculateAge(Number(user.birthday))}
      </h2>
      <p className="text-lg text-gray-200">{user.description}</p>
    </div>
  </div>
);

const Swiper = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const filters = useMemo(
    () => ({
      minAge: 1,
      maxAge: 99,
      gender: Gender.Undisclosed,
    }),
    []
  );

  const { users, loading, hasMore, loadMore, refetch, resetFilters } = useUsers({ filters });
  // Log pour le debug
  console.log("Current state in Swiper:", {
    usersLength: users?.length,
    loading,
    hasMore,
  });

  // Un seul useEffect pour le montage
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSwipe = useCallback(
    (newDirection) => {
      setDirection(newDirection);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + newDirection + users.length) % users.length;
          if (hasMore && users.length - nextIndex <= 3) {
            loadMore();
          }
          return nextIndex;
        });
        setDirection(0);
      }, ANIMATION_DURATION);
    },
    [users.length, hasMore, loadMore]
  );

  const handleLike = useCallback(() => {
    handleSwipe(1);
  }, [handleSwipe]);

  const handleDislike = useCallback(() => {
    handleSwipe(-1);
  }, [handleSwipe]);

  const handleSuperLike = useCallback(() => {
    handleSwipe(1);
  }, [handleSwipe]);

  const handleDragEnd = useCallback(
    (_, info) => {
      const dragDistance = info.point.x - dragStart.x;
      if (Math.abs(dragDistance) > SWIPE_THRESHOLD) {
        handleSwipe(dragDistance > 0 ? 1 : -1);
      }
    },
    [dragStart.x, handleSwipe]
  );

  if (loading) {
    return (
      <div className="w-full max-w-sm mx-auto flex justify-center items-center h-[580px]">
        <p className="text-gray-500">Chargement des profils...</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="w-full max-w-sm mx-auto flex justify-center items-center h-[580px]">
        <p className="text-gray-500">Aucun profil disponible</p>
      </div>
    );
  }

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
            <Card className="h-full overflow-hidden">
              <UserProfile user={currentUser} />
              <CardFooter className="flex justify-center gap-6 p-4">
                <ActionButton
                  Icon={ThumbsDown}
                  onClick={handleDislike}
                  variant="outline"
                  hoverClass="hover:bg-red-50 hover:text-red-500"
                  className={undefined}
                  iconClass={undefined}
                  href={undefined}
                />
                <ActionButton
                  Icon={Heart}
                  onClick={handleLike}
                  className="h-14 w-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                  iconClass="w-6 h-6"
                  variant={undefined}
                  hoverClass={undefined}
                  href={undefined}
                />
                <ActionButton
                  Icon={Star}
                  onClick={handleSuperLike}
                  variant="outline"
                  hoverClass="hover:bg-green-200 hover:text-green-500"
                  className={undefined}
                  iconClass={undefined}
                  href={undefined}
                />
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Swiper;

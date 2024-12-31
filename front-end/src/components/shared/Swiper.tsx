import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, ThumbsDown, Star } from "lucide-react";
import Image from "next/image";
import { Gender } from "@/types";
import { useUsers } from "@/hooks/useUsers";
import { calculateAge } from "@/utils/date.utils";
import { DEFAULT_PROFILE_URL } from "@/types/pinata.types";

const Swiper = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const filters = {
    minAge: 1,
    maxAge: 99,
    gender: Gender.Undisclosed,
  };
  const { users, loading, hasMore, loadMore } = useUsers({ filters });

  const handleDislike = () => {
    // Add your dislike logic here
    handleSwipe(-1);
  };

  const handleSuperLike = () => {
    // Add your super like logic here
    handleSwipe(1);
  };

  const handleSwipe = (newDirection) => {
    setDirection(newDirection);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + newDirection + users.length) % users.length);
      setDirection(0);
    }, 300);
  };

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

  return (
    <div className="w-full max-w-sm">
      {users != null && users.length > 0 ? (
        <div className="relative">
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
              className="absolute w-full"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragStart={(_, info) => {
                setDragStart({ x: info.point.x, y: info.point.y });
              }}
              onDragEnd={(_, info) => {
                const dragDistance = info.point.x - dragStart.x;
                if (Math.abs(dragDistance) > 100) {
                  handleSwipe(dragDistance > 0 ? 1 : -1);
                }
              }}
            >
              <Card className="overflow-hidden">
                <div className="relative h-[500px]">
                  <Image
                    src={DEFAULT_PROFILE_URL.concat(users[currentIndex].ipfsHashs[0])}
                    alt={users[currentIndex].ipfsHashs[0]}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 p-6 flex flex-col justify-end">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {users[currentIndex].firstName},{" "}
                      {calculateAge(Number(users[currentIndex].birthday))}
                    </h2>
                    <p className="text-lg text-gray-200">{users[currentIndex].description}</p>
                  </div>
                </div>
                <CardFooter className="flex justify-center gap-6 p-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                    onClick={() => handleSwipe(-1)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-colors"
                    onClick={() => handleDislike()}
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    onClick={() => handleSwipe(1)}
                  >
                    <Heart className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-colors"
                    onClick={() => handleSuperLike()}
                  >
                    <Star className="w-5 h-5" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <>
          <h2>Error...</h2>
        </>
      )}
    </div>
  );
};

export default Swiper;

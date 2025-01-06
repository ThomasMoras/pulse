import Image from "next/image";
import { calculateAge } from "@/utils/date.utils";
import { DEFAULT_PROFILE_URL } from "@/types/pinata.types";
import { User } from "@/types/swiper.types";

interface UserProfileProps {
  user: User | null;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  if (!user) {
    return <div>Chargement du profil...</div>;
  }

  return (
    <div className="relative h-[500px]">
      <Image
        src={DEFAULT_PROFILE_URL.concat(user.ipfsHashs?.[0] ?? "default-hash")}
        alt={`Photo de ${user.firstName}`}
        width={500}
        height={500}
        className="object-cover w-full h-full"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 p-6 flex flex-col justify-end">
        <h2 className="text-3xl font-bold text-white mb-2">
          {user.firstName}, {user.birthday ? calculateAge(Number(user.birthday)) : ""}
        </h2>
        <p className="text-lg text-gray-200">{user.description}</p>
      </div>
    </div>
  );
};

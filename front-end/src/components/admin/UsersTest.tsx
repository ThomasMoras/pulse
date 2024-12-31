import { GENDER_OPTIONS } from "@/constants/constants";
import { useUsers } from "@/hooks/useUsers";
import { Gender } from "@/types";
import { calculateAge } from "@/utils/date.utils";
import { FC } from "react";
import { User as UserIcon, MapPin, Heart } from "lucide-react";
import { DEFAULT_PROFILE_URL } from "@/types/pinata.types";

interface UserCardProps {
  user: User;
}

const UserCard: FC<UserCardProps> = ({ user }) => {
  const age = calculateAge(Number(user.birthday));
  const profileImg: string = DEFAULT_PROFILE_URL.concat(user.ipfsHashs[0]);

  console.log(user.ipfsHashs[0]);
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Image de profil avec overlay gradient */}
      <div className="relative h-48">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${profileImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Informations principales superposées sur l'image */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-semibold">{user.firstName}</h3>
            <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">{age} ans</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-white/90">
            <MapPin size={14} />
            <span>{user.localisation}</span>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-4 space-y-4">
        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">{user.description}</p>

        {/* Genre */}
        <div className="flex items-center gap-2 text-sm">
          <UserIcon size={16} className="text-purple-500" />
          <span className="text-gray-700">{GENDER_OPTIONS[user.gender].label}</span>
        </div>

        {/* Intérêts */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-rose-500" />
            <span className="text-sm font-medium text-gray-700">Intéressé par :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.interestedBy.map((genderNumber: number, index: number) => (
              <span key={index} className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full">
                {GENDER_OPTIONS[genderNumber].label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserList = () => {
  const filters = {
    minAge: 1,
    maxAge: 99,
    gender: Gender.Undisclosed,
  };

  const { users, loading, hasMore, loadMore } = useUsers({ filters });

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Grille des utilisateurs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user, index) => (
          <UserCard key={`${user.id || index}`} user={user} />
        ))}
      </div>

      {/* Bouton Charger plus */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Chargement...</span>
              </div>
            ) : (
              "Charger plus"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;

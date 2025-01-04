import { useMatch } from "@/contexts/matchContext";
import { useProfileData } from "@/hooks/useProfileData";
import { User } from "lucide-react";
import { useEffect } from "react";

// Composant pour charger le profil d'un match
export const MatchProfile = ({ match }) => {
  const { data: profile, isLoading } = useProfileData(match.partner.address);
  const { updateMatchProfile } = useMatch();

  useEffect(() => {
    if (profile && !isLoading) {
      updateMatchProfile(match.partner.address, profile);
    }
  }, [profile, isLoading, match.partner.address, updateMatchProfile]);

  return (
    <div
      className={`p-4 flex items-center space-x-4 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors ${!match.isRead ? "bg-blue-50" : ""}`}
    >
      <div className="relative w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {match.partner.image ? (
          <img
            src={match.partner.image}
            alt={match.partner.firstName || "avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-gray-500" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">
          {isLoading
            ? "Chargement..."
            : match.partner.firstName || `User ${match.partner.address.slice(0, 6)}...`}
        </h3>
        <p className="text-sm text-gray-500">{new Date(match.timestamp).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { DEFAULT_PROFILE_URL } from "@/types/pinata.types";

// Types pour la gestion des matches
interface MatchPartner {
  address: string;
  firstName?: string;
  image?: string;
}

interface Match {
  id: string;
  conversationId: string;
  partner: MatchPartner;
  timestamp: number;
  isRead: boolean;
}

interface MatchContextType {
  matches: Match[];
  addMatch: (matchData: any) => void;
  markAllAsRead: () => void;
  unreadCount: number;
  updateMatchProfile: (address: string, profileData: any) => void;
}

// Clé de stockage pour le localStorage
const MATCHES_STORAGE_KEY = "pulseMatches";

// Création du contexte
const MatchContext = createContext<MatchContextType | undefined>(undefined);

// Fonction utilitaire pour charger les matches depuis le localStorage
const loadStoredMatches = (): Match[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(MATCHES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading stored matches:", error);
    return [];
  }
};

// Provider du contexte
export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialisation de l'état avec les données du localStorage
  const [matches, setMatches] = useState<Match[]>(() => loadStoredMatches());

  // Sauvegarde dans le localStorage à chaque changement
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(matches));
        console.log("Matches saved to localStorage:", matches);
      } catch (error) {
        console.error("Error saving matches to localStorage:", error);
      }
    }
  }, [matches]);

  // Ajouter un nouveau match
  const addMatch = useCallback((matchData: any) => {
    console.log("Adding match to context:", matchData);

    setMatches((prev) => {
      // Vérification de l'existence du match
      const matchExists = prev.some(
        (match) =>
          match.conversationId === matchData.conversationId ||
          (match.partner.address === (matchData.recipient || matchData.sender) &&
            match.timestamp === matchData.timestamp)
      );

      if (matchExists) {
        console.log("Match already exists, skipping");
        return prev;
      }

      // Création du nouveau match
      const newMatch: Match = {
        id: `match-${matchData.conversationId}`,
        conversationId: matchData.conversationId,
        partner: {
          address: matchData.recipient || matchData.sender,
        },
        timestamp: matchData.timestamp || Date.now(),
        isRead: false,
      };

      console.log("Created new match:", newMatch);
      return [newMatch, ...prev];
    });
  }, []);

  // Mettre à jour le profil d'un match
  const updateMatchProfile = useCallback((address: string, profileData: any) => {
    console.log("Updating match profile:", { address, profileData });

    setMatches((prev) =>
      prev.map((match) => {
        if (match.partner.address.toLowerCase() === address.toLowerCase()) {
          const updatedMatch = {
            ...match,
            partner: {
              ...match.partner,
              firstName: profileData.firstName,
              image: profileData.ipfsHashs?.[0]
                ? DEFAULT_PROFILE_URL.concat(profileData.ipfsHashs[0])
                : undefined,
            },
          };
          console.log("Updated match:", updatedMatch);
          return updatedMatch;
        }
        return match;
      })
    );
  }, []);

  // Marquer tous les matches comme lus
  const markAllAsRead = useCallback(() => {
    console.log("Marking all matches as read");
    setMatches((prev) => prev.map((match) => ({ ...match, isRead: true })));
  }, []);

  // Calcul du nombre de matches non lus
  const unreadCount = matches.filter((match) => !match.isRead).length;

  // Logging de l'état des matches à chaque changement
  useEffect(() => {
    console.log("Current matches state:", matches);
    console.log("Unread count:", unreadCount);
  }, [matches, unreadCount]);

  return (
    <MatchContext.Provider
      value={{
        matches,
        addMatch,
        markAllAsRead,
        unreadCount,
        updateMatchProfile,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useMatch = () => {
  const context = useContext(MatchContext);

  if (context === undefined) {
    throw new Error("useMatch must be used within a MatchProvider");
  }

  return context;
};

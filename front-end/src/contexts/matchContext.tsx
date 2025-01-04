"use client";

import { DEFAULT_PROFILE_URL } from "@/types/pinata.types";
import React, { createContext, useContext, useState, useCallback } from "react";

interface Match {
  id: string;
  conversationId: string;
  partner: {
    address: string;
    firstName?: string;
    image?: string;
  };
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

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
  const [matches, setMatches] = useState<Match[]>([]);

  const addMatch = useCallback((matchData: any) => {
    setMatches((prev) => {
      const matchExists = prev.some(
        (match) =>
          match.conversationId === matchData.conversationId ||
          (match.partner.address === (matchData.recipient || matchData.sender) &&
            match.timestamp === matchData.timestamp)
      );

      if (matchExists) {
        return prev;
      }

      const newMatch: Match = {
        id: `match-${matchData.conversationId}`,
        conversationId: matchData.conversationId,
        partner: {
          address: matchData.recipient || matchData.sender,
        },
        timestamp: matchData.timestamp || Date.now(),
        isRead: false,
      };

      return [newMatch, ...prev];
    });
  }, []);

  const updateMatchProfile = useCallback((address: string, profileData: any) => {
    console.log(profileData);
    setMatches((prev) =>
      prev.map((match) => {
        if (match.partner.address.toLowerCase() === address.toLowerCase()) {
          return {
            ...match,
            partner: {
              ...match.partner,
              firstName: profileData.firstName,
              image: DEFAULT_PROFILE_URL.concat(profileData.ipfsHashs?.[0]) || undefined,
            },
          };
        }
        return match;
      })
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setMatches((prev) => prev.map((match) => ({ ...match, isRead: true })));
  }, []);

  const unreadCount = matches.filter((match) => !match.isRead).length;

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

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return context;
};

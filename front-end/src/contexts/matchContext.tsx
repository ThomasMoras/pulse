"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface Match {
  id: string;
  conversationId: string;
  partner: {
    address: string;
    name?: string;
    avatar?: string;
  };
  timestamp: number;
  isRead: boolean;
}

interface MatchContextType {
  matches: Match[];
  addMatch: (matchData: any) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
  const [matches, setMatches] = useState<Match[]>([]);

  const addMatch = useCallback((matchData: any) => {
    setMatches((prev) => {
      // Vérifier si le match existe déjà en utilisant conversationId
      const matchExists = prev.some(
        (match) =>
          match.conversationId === matchData.conversationId ||
          (match.partner.address === (matchData.recipient || matchData.sender) &&
            match.timestamp === matchData.timestamp)
      );

      if (matchExists) {
        return prev; // Ne pas ajouter de doublon
      }

      const newMatch: Match = {
        id: `match-${matchData.conversationId}`, // Utiliser conversationId pour l'id
        conversationId: matchData.conversationId,
        partner: {
          address: matchData.recipient || matchData.sender,
          name: matchData.name || undefined,
        },
        timestamp: matchData.timestamp || Date.now(),
        isRead: false,
      };

      return [newMatch, ...prev];
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setMatches((prev) => prev.map((match) => ({ ...match, isRead: true })));
  }, []);

  const unreadCount = matches.filter((match) => !match.isRead).length;

  return (
    <MatchContext.Provider value={{ matches, addMatch, markAllAsRead, unreadCount }}>
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

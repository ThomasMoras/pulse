"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { DEFAULT_PROFILE_URL } from "@/types/pinata.types";

// Types for match management
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

// Storage key for localStorage
const MATCHES_STORAGE_KEY = "pulseMatches";

// Create context with undefined default value
const MatchContext = createContext<MatchContextType | undefined>(undefined);

// Utility function to load matches from localStorage with proper error handling
const loadStoredMatches = (): Match[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(MATCHES_STORAGE_KEY);
    const parsedMatches = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsedMatches) ? parsedMatches : [];
  } catch (error) {
    console.error("Error loading stored matches:", error);
    return [];
  }
};

// Context Provider component
export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state with stored matches or empty array
  const [matches, setMatches] = useState<Match[]>(() => {
    const loadedMatches = loadStoredMatches();
    return Array.isArray(loadedMatches) ? loadedMatches : [];
  });

  // Save to localStorage on matches change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(matches));
      } catch (error) {
        console.error("Error saving matches to localStorage:", error);
      }
    }
  }, [matches]);

  // Add new match with duplicate checking
  const addMatch = useCallback((matchData: any) => {
    setMatches((prev) => {
      // Check for existing match
      const matchExists = prev.some(
        (match) =>
          match.conversationId === matchData.conversationId ||
          (match.partner.address === (matchData.recipient || matchData.sender) &&
            match.timestamp === matchData.timestamp)
      );

      if (matchExists) {
        return prev;
      }

      // Create new match
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

  // Update match profile
  const updateMatchProfile = useCallback((address: string, profileData: any) => {
    if (!address || typeof address !== "string") return;

    setMatches((prev) =>
      prev.map((match) => {
        if (match.partner.address.toLowerCase() === address.toLowerCase()) {
          return {
            ...match,
            partner: {
              ...match.partner,
              firstName: profileData?.firstName,
              image: profileData?.ipfsHashs?.[0]
                ? DEFAULT_PROFILE_URL.concat(profileData.ipfsHashs[0])
                : undefined,
            },
          };
        }
        return match;
      })
    );
  }, []);

  // Mark all matches as read
  const markAllAsRead = useCallback(() => {
    setMatches((prev) => prev.map((match) => ({ ...match, isRead: true })));
  }, []);

  // Calculate unread count with type safety
  const unreadCount = Array.isArray(matches) ? matches.filter((match) => !match.isRead).length : 0;

  // Optional: Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug("Matches updated:", matches);
      console.debug("Unread count:", unreadCount);
    }
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

// Custom hook with proper error handling
export const useMatch = () => {
  const context = useContext(MatchContext);

  if (context === undefined) {
    throw new Error("useMatch must be used within a MatchProvider");
  }

  return context;
};

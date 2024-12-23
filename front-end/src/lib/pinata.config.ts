// src/config/pinata.config.ts
import { PinataConfig } from "../types/pinata.types";
import dotenv from "dotenv";

dotenv.config();

export const pinataConfig: PinataConfig = {
  pinataApiKey: process.env.PINATA_API_KEY || "",
  pinataSecretApiKey: process.env.PINATA_SECRET_KEY || "",
};

// Fonction utilitaire pour vérifier la configuration
export const isPinataConfigured = () => {
  return Boolean(
    process.env.NEXT_PUBLIC_PINATA_API_KEY && process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
  );
};

export const PINATA_GATEWAY_URL = "https://gateway.pinata.cloud/ipfs";

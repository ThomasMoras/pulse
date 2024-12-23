import { PinataPinOptions } from "@pinata/sdk";

// Au lieu de définir PinataOptions nous-mêmes, nous allons utiliser le type du SDK
export type PinataOptions = PinataPinOptions;

// Le reste des types reste inchangé
export interface PinataConfig {
  pinataApiKey: string;
  pinataSecretApiKey: string;
}

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  gateway_url?: string; // Ajouté pour supporter notre URL personnalisée
}

export interface PinListResponse {
  rows: Array<{
    ipfs_pin_hash: string;
    size: number;
    date_pinned: string;
    metadata: any; // ou définir le type exact si nécessaire
  }>;
  count: number;
}

import { PinataPinOptions } from "@pinata/sdk";

export type PinataOptions = PinataPinOptions;

export interface PinataConfig {
  pinataApiKey: string;
  pinataSecretApiKey: string;
}

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  gateway_url?: string;
}

export interface PinListResponse {
  rows: Array<{
    ipfs_pin_hash: string;
    size: number;
    date_pinned: string;
    metadata: any;
  }>;
  count: number;
}

export const DEFAULT_PROFILE_URL = "https://purple-just-alpaca-870.mypinata.cloud/ipfs/";

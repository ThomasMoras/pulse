// services/pinata.service.ts
import axios from "axios";
import { PinataConfig, PinataOptions, PinataResponse } from "../types/pinata.types";

export class PinataService {
  private apiKey: string;
  private secretKey: string;

  constructor(config: PinataConfig) {
    if (!config.pinataApiKey || !config.pinataSecretApiKey) {
      throw new Error("Pinata API keys are required");
    }
    this.apiKey = config.pinataApiKey;
    this.secretKey = config.pinataSecretApiKey;
  }

  async uploadImage(file: File | string, options?: PinataOptions): Promise<PinataResponse> {
    try {
      const formData = new FormData();

      if (file instanceof File) {
        formData.append("file", file);
      } else {
        throw new Error("String paths not supported in browser environment");
      }

      // Ajouter les métadonnées à FormData si elles existent
      if (options?.pinataMetadata) {
        formData.append("pinataMetadata", JSON.stringify(options.pinataMetadata));
      }

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Accept": "application/json",
            "pinata_api_key": this.apiKey,
            "pinata_secret_api_key": this.secretKey,
          },
          maxBodyLength: Infinity,
        }
      );

      return {
        IpfsHash: response.data.IpfsHash,
        PinSize: response.data.PinSize,
        Timestamp: response.data.Timestamp,
        gateway_url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error("Erreur d'authentification Pinata. Vérifiez vos clés API");
      }
      throw error;
    }
  }
}

import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { CHAIN_CONFIG, SupportedChains } from "./chain";

export class LitEncryption {
  private litNodeClient: LitNodeClient;
  private chainConfig: (typeof CHAIN_CONFIG)[SupportedChains];
  private isTestnet: boolean;

  constructor(chain: SupportedChains, isTestnet: boolean = true) {
    this.chainConfig = CHAIN_CONFIG[chain];
    this.isTestnet = isTestnet;
    this.litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilDev,
      debug: false,
    });
  }

  async connect() {
    this.litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: LIT_NETWORK.DatilDev,
    });
    await this.litNodeClient.connect();
  }
}

const litEtherSepolia = new LitEncryption("ethereum", true);
await litEtherSepolia.connect();

import { LitEncryption } from "@/lib/LitEncryption";
import { useEffect, useState } from "react";

export function useLitEncryption(chain: "ethereum" | "base" = "ethereum") {
  const [encryption, setEncryption] = useState<LitEncryption | null>(null);

  useEffect(() => {
    const initEncryption = async () => {
      const litEncryption = new LitEncryption(chain, true); // true pour testnet
      await litEncryption.connect();
      setEncryption(litEncryption);
    };

    initEncryption();
  }, [chain]);

  return encryption;
}

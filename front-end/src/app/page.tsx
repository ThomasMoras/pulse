"use client";

import Dashboard from "@/components/shared/Dashboard";
import NotConnected from "@/components/shared/NotConnected";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return <>{isConnected ? <Dashboard /> : <NotConnected />}</>;
}

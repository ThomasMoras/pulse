"use client";

import Dashboard from "@/components/shared/Dashboard";
import NotConnected from "@/components/shared/NotConnected";
import { UserProvider } from "@/contexts/user-context";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <UserProvider>
      <>{isConnected ? <Dashboard /> : <NotConnected />}</>
    </UserProvider>
  );
}

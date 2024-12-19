"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAccount } from "wagmi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/user-context";

const Navbar = () => {
  const { isAccountCreated } = useUser();
  const { isConnected } = useAccount();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAvatarClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="flex justify-between items-center w-full p-5">
      <h1 className="text-2xl font-bold text-gray-800">Lovenect</h1>

      <div className="flex ml-auto">
        {isConnected && isAccountCreated && (
          <div>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger>
                <Avatar className="mr-4" onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link onClick={handleAvatarClick} href={"/profil"}>
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Mes avantages</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <ConnectButton />
      </div>
    </nav>
  );
};

export default Navbar;

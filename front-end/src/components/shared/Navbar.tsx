"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ModeToggle } from "./ToogleTheme";
import { useProfileData } from "@/hooks/useProfileData";
import { useRouter } from "next/navigation";
import { DEFAULT_PROFILE_URL } from "@/types/pinata.types";
import { Bell } from "lucide-react";
import Sidebar from "./Sidebar";

interface NavbarProps {
  isAccountCreated: boolean;
  address: string;
  isConnected: boolean;
  onToggleSidebar: () => void;
  NotificationBell: React.FC;
}

const Navbar: React.FC<NavbarProps> = ({
  isAccountCreated,
  isConnected,
  address,
  onToggleSidebar,
}) => {
  const router = useRouter();
  const { isLoading, data: profile, error } = useProfileData(address);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {}, [profile]);
  if (error) {
    return <div className="text-center p-4 text-red-500">Erreur lors du chargement du profil</div>;
  }

  const handleAvatarClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSidebarClick = () => {
    onToggleSidebar();
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full">
      <nav className="flex justify-between items-center w-full p-5">
        <Avatar
          className="mr-4"
          onClick={() => {
            router.replace("/");
          }}
          style={{ cursor: "pointer" }}
        >
          <AvatarImage src="/logo.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold text-gray-800">Lovenect</h1>
        <div className="flex ml-auto">
          <div className="mr-4">
            <ModeToggle />
          </div>
          <div className="mr-4 mt-2">
            <Bell />
          </div>
          {isConnected && isAccountCreated && (
            <div>
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger>
                  <Avatar
                    className="mr-4"
                    onClick={handleAvatarClick}
                    style={{ cursor: "pointer" }}
                  >
                    <AvatarImage
                      src={
                        profile != null
                          ? DEFAULT_PROFILE_URL.concat(profile.ipfsHashs[0])
                          : "https://github.com/shadcn.png"
                      }
                    />
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
                  <DropdownMenuItem onClick={handleSidebarClick}>Mes matches</DropdownMenuItem>
                  <DropdownMenuItem>Mes avantages</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link onClick={handleAvatarClick} href={"/admin"}>
                      Admin
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <ConnectButton />
        </div>
        <div className="absolute bottom-0 w-full h-px bg-gray-200" />

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </nav>
    </div>
  );
};

export default Navbar;

"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center w-full p-5">
      <div className="ml-auto">
        <ConnectButton />
      </div>
    </nav>
  );
};

export default Navbar;

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useUser } from "@/contexts/user-context";
import { useAccount } from "wagmi";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAccountCreated } = useUser();
  const { address, isConnected } = useAccount();
  return (
    <>
      <header className="header">
        <Navbar
          isAccountCreated={isAccountCreated}
          address={address}
          isConnected={isConnected}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </header>
      <Sidebar
        isAccountCreated={isAccountCreated}
        isConnected={isConnected}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
};

export default Header;

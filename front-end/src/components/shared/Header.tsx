import { useState } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useUser } from "../../contexts/user-context";
import { useAccount } from "wagmi";
import { useMatch } from "../../contexts/matchContext";

const NotificationBell = ({ onClick }: { onClick: () => void }) => {
  const { unreadCount } = useMatch();

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800" />
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        >
          {unreadCount}
        </motion.div>
      )}
    </div>
  );
};

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAccountCreated } = useUser();
  const { address, isConnected } = useAccount();
  const { markAllAsRead } = useMatch();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (!isSidebarOpen) {
      markAllAsRead();
    }
  };

  return (
    <>
      <header className="header">
        <Navbar
          isAccountCreated={isAccountCreated}
          address={address}
          isConnected={isConnected}
          onToggleSidebar={handleToggleSidebar}
          NotificationBell={() => <NotificationBell onClick={handleToggleSidebar} />}
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

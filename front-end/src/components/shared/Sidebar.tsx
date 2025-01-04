import React, { useState } from "react";
import { ArrowLeftCircleIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMatch } from "@/contexts/matchContext";
import { useAccount, useWatchContractEvent } from "wagmi";
import { pulseContract } from "@/contracts/pulse.contract";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInteraction } from "@/hooks/useInteraction";
import { MatchProfile } from "../utils/MatchProfile";
import Chat from "./Chat";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isAccountCreated: boolean;
  isConnected: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAccountCreated, isConnected, isOpen, onClose }) => {
  const { matches, addMatch } = useMatch();
  const { address } = useAccount();
  const [selectedChat, setSelectedChat] = useState(null);
  const { logMatchData } = useInteraction(() => {});

  // Surveillance des événements Match
  useWatchContractEvent({
    address: pulseContract.address,
    abi: pulseContract.abi,
    eventName: "Match",
    onLogs(logs) {
      logs.forEach((log) => {
        try {
          const sender = log.args.sender as string;
          const receiver = log.args.receiver as string;
          const conversationId = log.args.conversationId as string;

          // Ne traiter que les événements où l'utilisateur courant est impliqué
          if (
            sender?.toLowerCase() === address?.toLowerCase() ||
            receiver?.toLowerCase() === address?.toLowerCase()
          ) {
            addMatch({
              sender,
              recipient: sender.toLowerCase() === address?.toLowerCase() ? receiver : sender,
              conversationId,
              timestamp: Date.now(),
            });
          }
        } catch (error) {
          console.error("Erreur lors du traitement du match:", error);
        }
      });
    },
  });

  // Effet pour les nouveaux matches via useInteraction
  React.useEffect(() => {
    if (logMatchData) {
      addMatch(logMatchData);
    }
  }, [logMatchData, addMatch]);

  const handleChatClick = (match) => {
    console.log(match);
    setSelectedChat(match);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  return (
    <>
      {isConnected && isAccountCreated && (
        <>
          {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}
          <div
            className={`fixed left-0 top-[90px] h-[calc(100vh-90px)] w-72 bg-white 
              dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out 
              z-40 border-r border-gray-200 dark:border-gray-700
              transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold">Mes matchs</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Fermer le menu"
                >
                  <ArrowLeftCircleIcon className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4">
                <AnimatePresence>
                  {matches.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      {matches.map((match) => (
                        <motion.div
                          key={match.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          onClick={() => handleChatClick(match)}
                          className="cursor-pointer"
                        >
                          <MatchProfile match={match} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center text-gray-500 mt-8">Aucun match pour le moment</div>
                  )}
                </AnimatePresence>
              </nav>
            </div>
          </div>

          {/* Dialog pour le chat */}
          <Dialog open={!!selectedChat} onOpenChange={handleCloseChat}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[700px] h-[80vh]">
              <DialogHeader>
                <DialogTitle>
                  Chat avec{" "}
                  {selectedChat?.partner.firstName ||
                    `${selectedChat?.partner.address.slice(0, 6)}...${selectedChat?.partner.address.slice(-4)}`}
                </DialogTitle>
              </DialogHeader>
              {selectedChat && (
                <div className="flex-1 -mx-6 -mb-6 mt-2">
                  <Chat
                    conversationId={selectedChat.conversationId}
                    partnerAddress={selectedChat.partner.address}
                    partnerName={selectedChat.partner.firstName}
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default Sidebar;

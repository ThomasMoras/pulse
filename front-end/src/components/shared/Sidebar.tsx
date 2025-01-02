import React from "react";
import { ArrowLeftCircleIcon } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay sombre */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-[90px] h-[calc(100vh-90px)] w-72 bg-white dark:bg-gray-800 
        shadow-lg transition-transform duration-300 ease-in-out z-40 
        border-r border-gray-200 dark:border-gray-700
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

          {/* Contenu principal */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {/* {navigationItems.map((item, index) => (
                <li key={index}>
        
                  </a>
                </li>
              ))} */}
            </ul>
          </nav>

          {/* Footer */}
          {/* <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">© 2024 Lovenect</div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;

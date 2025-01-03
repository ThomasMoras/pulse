import { User } from "lucide-react";

export const Conversation = ({ match }) => {
  return (
    <div
      className={`p-4 flex items-center space-x-4 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors ${!match.isRead ? "bg-blue-50" : ""}`}
    >
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
        {match.partner.avatar ? (
          <img src={match.partner.avatar} alt="avatar" className="w-full h-full rounded-full" />
        ) : (
          <User className="w-6 h-6 text-gray-500" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">
          {match.partner.name || `User ${match.partner.address.slice(0, 6)}...`}
        </h3>
        <p className="text-sm text-gray-500">{new Date(match.timestamp).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

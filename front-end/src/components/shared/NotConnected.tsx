import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const NotConnected = () => {
  return (
    <div className="p-5 text-center max-w-2xl mx-auto">
      <Alert className="bg-orange-200 border-2 border-orange-400 rounded-lg p-4">
        <AlertTitle className="text-2xl font-bold">Warning</AlertTitle>
        <AlertDescription className="text-lg">
          Please, connect your wallet to our DApp.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NotConnected;

import React, { useEffect } from "react";

import { CreateAccount } from "./CreateAccount";
import { useUser } from "@/contexts/user-context";

const Dashboard = () => {
  const { isAccountCreated } = useUser();

  useEffect(() => {
    console.log("isAccountCreated :", isAccountCreated);
  }, [isAccountCreated]);

  return (
    <div className="flex justify-center items-center">
      {!isAccountCreated ? (
        <div className="w-1/3">
          <CreateAccount />
        </div>
      ) : (
        <h1>Bienvenue sur la page Home !</h1>
      )}
    </div>
  );
};

export default Dashboard;

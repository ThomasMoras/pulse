import React, { useEffect } from "react";

import { CreateAccount } from "./CreateAccount";
import { useUser } from "@/contexts/user-context";
import Swiper from "@/components/shared/Swiper";

const Dashboard = () => {
  const { isAccountCreated } = useUser();

  useEffect(() => {}, [isAccountCreated]);

  return (
    <div className="flex flex-col space-y-10 px-4">
      <div className="flex justify-center">
        {!isAccountCreated ? (
          <div className="w-1/3">
            <CreateAccount />
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Bienvenue sur la page Home !</h1>
            <div className="pt-4">
              <Swiper />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

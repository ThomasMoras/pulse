import React, { useEffect } from "react";

import { CreateAccount } from "./CreateAccount";
import { useUser } from "../../contexts/user-context";
import Swiper from "../shared/Swiper";

const Dashboard = () => {
  const { isAccountCreated } = useUser();

  useEffect(() => {}, [isAccountCreated]);

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8">
        {!isAccountCreated ? (
          <div className="w-1/3 mx-auto">
            <CreateAccount />
          </div>
        ) : (
          <div className="flex justify-center items-center w-full">
            <Swiper />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

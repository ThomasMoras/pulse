import { EditProfile } from "@/components/shared/EditProfile";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-1/3">
        <EditProfile />
      </div>
    </div>
  );
};

export default page;

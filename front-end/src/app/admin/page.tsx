"use client";
import { UsersTest } from "@/components/admin/UsersTest";
import React from "react";

const page = () => {
  return (
    <div>
      {/* Section UsersTest avec grille alignée */}
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Liste des utilisateurs :</h2>
        <div className="flex">
          <UsersTest />
        </div>
      </div>
    </div>
  );
};

export default page;

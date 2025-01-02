"use client";
import React from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { UserProvider } from "@/contexts/user-context";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <UserProvider>
        {/* Header fixe */}
        <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-50">
          <Header />
        </div>

        {/* Espace pour compenser le header fixe */}
        <div className="h-[73px]" />

        {/* Container principal scrollable */}
        <div className="min-h-[calc(100vh-73px)]">
          <main className="w-full">{children}</main>
        </div>

        <Footer />
      </UserProvider>
    </div>
  );
};

export default Layout;

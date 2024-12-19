"use client";
import React from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { UserProvider } from "@/contexts/user-context";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app">
      <UserProvider>
        <Header />
        <main className="main">{children}</main>
        <Footer />
      </UserProvider>
    </div>
  );
};

export default Layout;

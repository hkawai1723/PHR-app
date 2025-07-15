import React from "react";
import { Navbar } from "@/components/navbar";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <nav>
        <Navbar />
      </nav>
      <div className="mt-18 flex h-screen w-screen bg-blue-50">
        <main className="w-full h-full">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

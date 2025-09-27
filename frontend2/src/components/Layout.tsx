import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "./Navbar";
import { AppSidebar } from "./AppSidebar";
import Dashboard from "@/pages/Dashboard";
import SavedGigs from "@/pages/SavedGigs";
import Settings from "@/pages/Settings";

export function Layout() {
  const [selectedPlatform, setSelectedPlatform] = useState<'reddit' | 'discord' | 'twitter' | 'facebook'>('reddit');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          selectedPlatform={selectedPlatform} 
          onPlatformChange={setSelectedPlatform}
        />
        
        <div className="flex-1 flex flex-col">
          <Navbar />
          
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard selectedPlatform={selectedPlatform} />} />
              <Route path="/saved" element={<SavedGigs />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
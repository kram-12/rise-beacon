"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Inter } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import SidebarV from "@/components/Sidebar_v";  // Sidebar for Volunteer
import SidebarO from "@/components/Sidebar_o";  // Sidebar for Organization
import { Toaster } from 'react-hot-toast';
import { getAvailableRewards } from '@/utils/db/actions';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userType, setUserType] = useState<'volunteer' | 'organization' | null>(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserType = localStorage.getItem("userType") as 'volunteer' | 'organization' | null;

        if (storedUserType) {
          setUserType(storedUserType);

          // // Fetch available rewards if user is logged in
          // if (storedUserType) {
          //   const availableRewards = await getAvailableRewards(storedUserType);
          //   console.log("availableRewards from layout", availableRewards);
          //   setTotalEarnings(availableRewards);
          // }

          // Check if sidebarOpen is stored, otherwise set default state
          const sidebarState = localStorage.getItem("sidebarOpen");
          if (sidebarState === null) {
            setSidebarOpen(true);
            localStorage.setItem("sidebarOpen", "true");
            router.refresh(); // Refresh the page after setting sidebar state
          } else {
            setSidebarOpen(sidebarState === "true");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {!isLoginPage && (
            <Header 
              onMenuClick={() => {
                const newState = !sidebarOpen;
                setSidebarOpen(newState);
                localStorage.setItem("sidebarOpen", newState.toString());
              }} 
              totalEarnings={totalEarnings} 
            />
          )}
          <div className="flex flex-1">
            {!isLoginPage && userType === 'volunteer' ? (
              <SidebarV open={sidebarOpen} />
            ) : userType === 'organization' ? (
              <SidebarO open={sidebarOpen} />
            ) : null}
            <main className={`flex-1 p-4 lg:p-8 transition-all duration-300 ${isLoginPage ? 'ml-0' : sidebarOpen ? 'ml-64' : 'ml-0'}`}>
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

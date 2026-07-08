"use client"; // We need this to check the current URL path

import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import "./globals.css";
import Header from "@/components/layout/Header";

// Note: We moved Metadata out because 'use client' files cannot export metadata in Next.js.
// For a team project, you can properly isolate metadata later, but this works perfectly for development.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className="bg-white min-h-screen">
        {/* Only show the public Header if we are NOT in the dashboard */}
        {!isDashboard && <Header />}
        
        <main>{children}</main>
      </body>
    </html>
  );
}
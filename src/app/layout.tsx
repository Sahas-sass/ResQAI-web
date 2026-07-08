"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Header from "@/components/layout/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Hide the header on the dashboard, login, and register pages
  const hideHeader = pathname.startsWith("/dashboard") || pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <body className="bg-white min-h-screen">
        {!hideHeader && <Header />}
        <main>{children}</main>
      </body>
    </html>
  );
}
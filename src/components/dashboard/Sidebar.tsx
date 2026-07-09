"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Define all navigation routes here. 
// I added "Command Overview" as the main /dashboard route!
const navItems = [
  { name: "Command Overview", href: "/dashboard", icon: "🖥️" },
  { name: "Live Crisis Map", href: "/dashboard/map", icon: "🗺️" },
  { name: "Smart Dispatch", href: "/dashboard/dispatch", icon: "🚑" },
  { name: "Incoming SOS", href: "/dashboard/sos", icon: "🚨" }, 
  { name: "AI Analytics", href: "/dashboard/analytics", icon: "📊" },
  { name: "Responders", href: "/dashboard/responders", icon: "👨‍🚒" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-neutral-950 border-r border-neutral-800 flex flex-col justify-between">
      <div>
        {/* Top Header / Logo */}
        <div className="p-6">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="bg-red-600 text-white px-2 py-1 rounded">R</span> 
            ResQAI <span className="border border-neutral-700 text-xs px-1 rounded text-neutral-400">OPS</span>
          </h1>
        </div>

        {/* Dynamic Navigation */}
        <nav className="px-4 space-y-2 mt-2">
          <p className="text-xs font-semibold text-neutral-500 mb-4 px-2 tracking-wider">MAIN MENU</p>
          
          {navItems.map((item) => {
            // Checks if the current URL matches the button's destination
            const isActive = pathname === item.href;

            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-red-950/40 text-red-500 border border-red-900/50" 
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200" 
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Operator 01 Profile Card */}
      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-3 p-3 bg-[#13151a] rounded-xl border border-neutral-800">
          
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 shadow-inner">
            <span className="text-neutral-300 font-bold text-sm">OP</span>
          </div>
          
          {/* Status Text */}
          <div>
            <p className="text-sm font-bold text-white">Operator 01</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {/* Pulsing Green Dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-xs text-green-500 font-medium">Active</p>
            </div>
          </div>
          
        </div>
      </div>
    </aside>
  );
}
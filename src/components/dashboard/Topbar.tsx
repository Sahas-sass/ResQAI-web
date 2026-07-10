"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Topbar() {
  const router = useRouter();

  const handleSignOut = async () => {
    // 1. Tell Supabase to kill the user's session
    await supabase.auth.signOut();
    
    // 2. Redirect the user back to the login page (or homepage)
    router.push("/"); 
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-neutral-900/50 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-50">
      
      {/* Left Side: Title */}
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-white tracking-wide">
          Command Center
        </h2>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center">
        
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-medium text-neutral-300 bg-[#13151a] border border-neutral-700 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-500 transition-all duration-200 shadow-sm"
        >
          Sign Out
        </button>
        
      </div>
    </header>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Successful login, redirect to the command center
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full bg-resq-dark flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-resq-red/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-resq-red/10 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-resq-red rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-resq-red/30">R</div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Operator Login</h2>
          <p className="text-gray-400 text-sm mt-2">Access the ResQAI Command Center</p>
        </div>

        {error && (
          <div className="p-4 rounded-lg mb-6 text-sm bg-red-500/20 text-red-200 border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@resqai.lk" 
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-resq-red transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-resq-red transition-colors"
            />
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" className="rounded bg-black/20 border-white/10 text-resq-red focus:ring-resq-red accent-resq-red" />
              Remember me
            </label>
            <Link href="#" className="text-sm text-resq-red hover:text-white transition-colors">Forgot Password?</Link>
          </div>

          <div className="mt-4">
            <button 
              type="submit" disabled={loading}
              className="w-full bg-resq-red text-white font-bold rounded-lg px-4 py-3 hover:bg-resq-darkRed transition-colors shadow-lg shadow-resq-red/20 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </div>

          <div className="text-center mt-2">
            <p className="text-sm text-gray-400">
              Need an operator account? <Link href="/register" className="text-resq-red hover:text-white transition-colors font-medium">Request access</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
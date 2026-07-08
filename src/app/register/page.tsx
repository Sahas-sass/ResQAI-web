"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [badge, setBadge] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          badge_number: badge,
        }
      }
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "Registration successful! Please check your email to verify your account." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-resq-dark flex items-center justify-center relative overflow-hidden py-10">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-resq-red/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-resq-red/10 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col mt-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-resq-red rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-resq-red/30">R</div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Request Access</h2>
          <p className="text-gray-400 text-sm mt-2">Register as a ResQAI Operator or Responder</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.type === 'error' ? 'bg-red-500/20 text-red-200 border border-red-500/50' : 'bg-green-500/20 text-green-200 border border-green-500/50'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe" 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-resq-red transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Badge / ID Number</label>
              <input 
                type="text" required value={badge} onChange={(e) => setBadge(e.target.value)}
                placeholder="OP-7742" 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-resq-red transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Official Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.doe@resqai.lk" 
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-resq-red transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)} minLength={6}
              placeholder="••••••••" 
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-resq-red transition-colors"
            />
          </div>

          <div className="mt-4">
            <button 
              type="submit" disabled={loading}
              className="w-full bg-resq-red text-white font-bold rounded-lg px-4 py-3 hover:bg-resq-darkRed transition-colors shadow-lg shadow-resq-red/20 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Submit Registration"}
            </button>
          </div>

          <div className="text-center mt-2">
            <p className="text-sm text-gray-400">
              Already have an account? <Link href="/login" className="text-resq-red hover:text-white transition-colors font-medium">Sign in here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
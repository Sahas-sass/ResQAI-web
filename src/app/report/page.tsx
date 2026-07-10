"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SOSReport() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', text: string } | null>(null); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location || !description) {
      setStatus({ type: 'error', text: "Please provide both location and description." });
      return;
    }

    setLoading(true);
    setStatus(null);

    // Insert the data into our new Supabase table
    const { error } = await supabase
      .from('sos_reports')
      .insert([
        { location: location, description: description }
      ]);

    if (error) {
      setStatus({ type: 'error', text: "Failed to dispatch SOS: " + error.message });
    } else {
      setStatus({ type: 'success', text: "SOS DISPATCHED SUCCESSFULLY. Help is on the way." });
      // Clear the form on success
      setLocation("");
      setDescription("");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-12 px-4 relative">
      <div className="absolute top-0 w-full bg-resq-red text-white text-center py-2 text-xs font-bold uppercase tracking-widest z-0">
        Official ResQAI Emergency Reporting Portal
      </div>

      <div className="relative z-10 w-full max-w-2xl mt-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-resq-dark transition">
            ← Back to Home
          </Link>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-resq-red shadow-sm">ENG</button>
            <button className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-bold text-gray-400 hover:text-gray-600 transition">සිංහල</button>
            <button className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-bold text-gray-400 hover:text-gray-600 transition">தமிழ்</button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-8 flex flex-col gap-8">
          
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-resq-dark tracking-tight mb-2">Report an Emergency</h1>
            <p className="text-gray-500 text-sm">Please provide accurate details. Our AI will automatically prioritize your request.</p>
          </div>

          {status && (
            <div className={`p-4 rounded-xl text-center font-bold text-sm ${status.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200 animate-pulse'}`}>
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <label className="block text-sm font-bold text-resq-dark mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-resq-dark text-white rounded-full flex items-center justify-center text-xs">1</span>
                Incident Location
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="E.g., 45 Galle Road, Colombo 03" 
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-resq-red transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <label className="block text-sm font-bold text-resq-dark mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-resq-dark text-white rounded-full flex items-center justify-center text-xs">2</span>
                Describe the Situation
              </label>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., Two-vehicle collision, someone is trapped..." 
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-resq-red transition resize-none"
                disabled={loading}
              ></textarea>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <label className="block text-sm font-bold text-resq-dark mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-resq-dark text-white rounded-full flex items-center justify-center text-xs">
                3
              </span>
              Upload Evidence
            </label>

            <input
              type="file"
              accept=".jpg,.png,.mp4,.wav"
              disabled={loading}
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                if (file.size > 5 * 1024 * 1024) {
                  setStatus({
                    type: "error",
                    text: "File size must be less than 5MB."
                  });
                  return;
                }

                  setMediaFile(file);
                  setStatus(null);
                }}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm"
              />

              {mediaFile && (
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {mediaFile.name}
                </p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-resq-red text-white font-extrabold text-lg rounded-xl px-4 py-5 hover:bg-resq-darkRed transition-colors shadow-xl shadow-resq-red/20 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "TRANSMITTING..." : "🚨 DISPATCH EMERGENCY SOS"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
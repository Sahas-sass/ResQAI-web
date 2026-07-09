"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Connect to Supabase using your frontend anon keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AnalyticsDashboard() {
  const [data, setData] = useState([
    { name: "Critical", count: 0, color: "#ef4444" }, // Red
    { name: "High", count: 0, color: "#f97316" },     // Orange
    { name: "Medium", count: 0, color: "#eab308" },   // Yellow
    { name: "Low", count: 0, color: "#22c55e" },      // Green
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      // Fetch all reports to aggregate the AI scores
      const { data: reports, error } = await supabase
        .from("sos_reports")
        .select("status");

      if (reports && !error) {
        const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        
        reports.forEach((report) => {
          if (counts[report.status as keyof typeof counts] !== undefined) {
            counts[report.status as keyof typeof counts]++;
          }
        });

        setData([
          { name: "Critical", count: counts.Critical, color: "#ef4444" },
          { name: "High", count: counts.High, color: "#f97316" },
          { name: "Medium", count: counts.Medium, color: "#eab308" },
          { name: "Low", count: counts.Low, color: "#22c55e" },
        ]);
      }
      setLoading(false);
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Triage Analytics</h1>
        <p className="text-neutral-400 mb-8">Real-time system intelligence and severity distribution.</p>

        {loading ? (
          <div className="h-64 flex items-center justify-center border border-neutral-800 rounded-xl bg-neutral-900/50 animate-pulse">
            <p className="text-neutral-500">Compiling Intelligence...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* The Main Chart Card */}
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-md shadow-2xl">
              <h2 className="text-xl font-semibold mb-6">Active Crisis Distribution</h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis dataKey="name" stroke="#737373" />
                    <YAxis stroke="#737373" allowDecimals={false} />
                    <Tooltip 
                      cursor={{ fill: '#262626' }}
                      contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform Metrics Card */}
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-md shadow-2xl flex flex-col justify-center">
              <h2 className="text-xl font-semibold mb-6">System Health</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-neutral-400 text-sm mb-1">Total Reports Analyzed</p>
                  <p className="text-4xl font-light">
                    {data.reduce((acc, curr) => acc + curr.count, 0)}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm mb-1">AI Engine Status</p>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <p className="text-green-500 font-medium">Online & Processing</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
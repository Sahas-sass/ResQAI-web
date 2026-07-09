"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { supabase } from "@/lib/supabase";

// Helper function to color-code the badges
const getBadgeColor = (status: string) => {
  switch (status) {
    case "Critical": return "bg-red-500/20 text-red-500 border-red-500/50";
    case "High": return "bg-orange-500/20 text-orange-500 border-orange-500/50";
    case "Medium": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
    case "Low": return "bg-green-500/20 text-green-500 border-green-500/50";
    default: return "bg-neutral-500/20 text-neutral-400 border-neutral-500/50";
  }
};

export default function AnalyticsDashboard() {
  const [chartData, setChartData] = useState([
    { name: "Critical", count: 0, color: "#ef4444" },
    { name: "High", count: 0, color: "#f97316" },
    { name: "Medium", count: 0, color: "#eab308" },
    { name: "Low", count: 0, color: "#22c55e" },
  ]);
  
  // New state to hold the actual message data
  const [recentSOS, setRecentSOS] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      // Fetch all reports, including descriptions, ordered by newest first
      const { data: reports, error } = await supabase
        .from("sos_reports")
        .select("id, status, description, created_at")
        .order("created_at", { ascending: false });

      if (reports && !error) {
        // 1. Calculate counts for the chart
        const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        
        reports.forEach((report) => {
          if (counts[report.status as keyof typeof counts] !== undefined) {
            counts[report.status as keyof typeof counts]++;
          }
        });

        setChartData([
          { name: "Critical", count: counts.Critical, color: "#ef4444" },
          { name: "High", count: counts.High, color: "#f97316" },
          { name: "Medium", count: counts.Medium, color: "#eab308" },
          { name: "Low", count: counts.Low, color: "#22c55e" },
        ]);

        // 2. Save the 5 most recent messages for the new feed
        setRecentSOS(reports.slice(0, 5));
      }
      setLoading(false);
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 overflow-y-auto pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Triage Analytics</h1>
        <p className="text-neutral-400 mb-8">Real-time system intelligence and severity distribution.</p>

        {loading ? (
          <div className="h-64 flex items-center justify-center border border-neutral-800 rounded-xl bg-neutral-900/50 animate-pulse">
            <p className="text-neutral-500">Compiling Intelligence...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* The Main Chart Card */}
              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-md shadow-2xl">
                <h2 className="text-xl font-semibold mb-6">Active Crisis Distribution</h2>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="#737373" />
                      <YAxis stroke="#737373" allowDecimals={false} />
                      <Tooltip 
                        cursor={{ fill: '#262626' }}
                        contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', borderRadius: '8px' }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
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
                      {chartData.reduce((acc, curr) => acc + curr.count, 0)}
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

            {/* NEW: Recent AI Intercepts Feed */}
            <div className="mt-8 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-md shadow-2xl">
              <h2 className="text-xl font-semibold mb-6">Recent AI Intercepts</h2>
              <div className="space-y-4">
                {recentSOS.length === 0 ? (
                  <p className="text-neutral-500 italic">No incoming reports yet.</p>
                ) : (
                  recentSOS.map((report) => (
                    <div 
                      key={report.id} 
                      className="flex items-center justify-between p-4 bg-[#13151a] border border-neutral-800 rounded-xl"
                    >
                      <div className="flex-1 pr-6">
                        <p className="text-sm text-neutral-300 font-medium leading-relaxed">
                          "{report.description || "No description provided"}"
                        </p>
                        <p className="text-xs text-neutral-600 mt-2">
                          {new Date(report.created_at).toLocaleString()}
                        </p>
                      </div>
                      
                      {/* Dynamic Badge */}
                      <div className={`px-3 py-1 rounded-md border text-xs font-bold tracking-wide uppercase ${getBadgeColor(report.status)}`}>
                        {report.status || "Pending"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function KPICards() {
  const [highSeverityCount, setHighSeverityCount] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState("0m 0s");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKPIs() {
      // Fetch all reports to calculate our metrics
      const { data: reports, error } = await supabase
        .from("sos_reports")
        .select("*");

      if (reports && !error) {
        // 1. Calculate Active High/Critical Threats
        const activeThreats = reports.filter(
          (report) => (report.status === "High" || report.status === "Critical") 
        );
        setHighSeverityCount(activeThreats.length);

        // 2. Calculate Average Response Time 
        // (Time between creation and when an operator updates/dispatches it)
        let totalMilliseconds = 0;
        let respondedCount = 0;

        reports.forEach((report) => {
          // We only count reports that have been updated by an operator/AI
          if (report.updated_at && report.updated_at !== report.created_at) {
            const createdTime = new Date(report.created_at).getTime();
            const updatedTime = new Date(report.updated_at).getTime();
            
            totalMilliseconds += (updatedTime - createdTime);
            respondedCount++;
          }
        });

        if (respondedCount > 0) {
          const avgMs = totalMilliseconds / respondedCount;
          const minutes = Math.floor(avgMs / 60000);
          const seconds = ((avgMs % 60000) / 1000).toFixed(0);
          setAvgResponseTime(`${minutes}m ${seconds}s`);
        }
      }
      setLoading(false);
    }

    // Fetch immediately, then set an interval to refresh every 10 seconds
    fetchKPIs();
    const interval = setInterval(fetchKPIs, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="animate-pulse h-32 bg-neutral-900/50 rounded-2xl border border-neutral-800"></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* High Severity Card */}
      <div className="p-6 rounded-2xl bg-[#13151a] border border-neutral-800 shadow-xl flex flex-col justify-center">
        <p className="text-neutral-400 font-medium text-sm mb-2">Active High Severity</p>
        <p className="text-5xl font-extrabold text-[#ff7b00] tracking-tight">
          {highSeverityCount}
        </p>
      </div>

      {/* Average Response Time Card */}
      <div className="p-6 rounded-2xl bg-[#13151a] border border-neutral-800 shadow-xl flex flex-col justify-center">
        <p className="text-neutral-400 font-medium text-sm mb-2">Avg System Response Time</p>
        <p className="text-5xl font-extrabold text-[#2563eb] tracking-tight">
          {avgResponseTime}
        </p>
      </div>

    </div>
  );
}
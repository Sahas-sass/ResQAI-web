"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Define the shape of our data
interface SOSReport {
  id: string;
  location: string;
  description: string;
  status: string;
  created_at: string;
  updated_at?: string; // Optional, used for response time math
}

export default function DashboardHome() {
  const [reports, setReports] = useState<SOSReport[]>([]);
  const [loading, setLoading] = useState(true);
  
  // KPI States
  const [totalResponders, setTotalResponders] = useState(0);
  const [highSeverityCount, setHighSeverityCount] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState("0m 0s");

  useEffect(() => {
    // 1. Fetch all dashboard data
    const fetchDashboardData = async () => {
      // Fetch total responders
      const { count: responderCount } = await supabase
        .from("responders")
        .select("*", { count: "exact", head: true });
      if (responderCount !== null) setTotalResponders(responderCount);

      // Fetch all reports to calculate KPIs
      const { data: allReports, error: kpiError } = await supabase
        .from("sos_reports")
        .select("*");

      if (!kpiError && allReports) {
        // Calculate High/Critical threats
        const activeThreats = allReports.filter(r => r.status === "High" || r.status === "Critical");
        setHighSeverityCount(activeThreats.length);

        // Calculate Average Response Time
        let totalMs = 0;
        let respondedCount = 0;
        allReports.forEach((report) => {
          if (report.updated_at && report.updated_at !== report.created_at) {
            const created = new Date(report.created_at).getTime();
            const updated = new Date(report.updated_at).getTime();
            totalMs += (updated - created);
            respondedCount++;
          }
        });
        if (respondedCount > 0) {
          const avgMs = totalMs / respondedCount;
          const minutes = Math.floor(avgMs / 60000);
          const seconds = ((avgMs % 60000) / 1000).toFixed(0);
          setAvgResponseTime(`${minutes}m ${seconds}s`);
        }
      }

      // Fetch the 10 most recent for the live feed
      const { data: recentReports } = await supabase
        .from("sos_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (recentReports) setReports(recentReports);
      setLoading(false);
    };

    fetchDashboardData();

    // 2. Set up Realtime Subscription for SOS reports
    const sosSubscription = supabase
      .channel("sos_reports_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sos_reports" },
        (payload) => {
          console.log("New SOS Received!", payload);
          setReports((currentReports) => [
            payload.new as SOSReport,
            ...currentReports,
          ]);
          // Re-calculate KPIs in the background
          fetchDashboardData();
        }
      )
      .subscribe();

    // 3. Set up Realtime Subscription for responders count updates
    const respondersSub = supabase
      .channel("responders_count_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "responders" },
        () => {
          // Re-fetch responder count if the table changes
          fetchDashboardData();
        }
      )
      .subscribe();

    // Cleanup subscriptions when leaving the page
    return () => {
      supabase.removeChannel(sosSubscription);
      supabase.removeChannel(respondersSub);
    };
  }, []);

  // Helper to color code the incoming live alerts
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Critical": return "bg-red-500 text-white";
      case "High": return "bg-orange-500 text-white";
      case "Medium": return "bg-yellow-500 text-black";
      case "Low": return "bg-green-500 text-white";
      default: return "bg-neutral-600 text-white"; // For PENDING
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-8 bg-neutral-950 min-h-screen text-white">
      
      <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Command Overview</h1>
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Active Emergencies", value: reports.length.toString(), color: "text-red-500" },
          { title: "Total Responders", value: loading ? "..." : totalResponders.toString(), color: "text-green-500" },
          { title: "High Severity", value: loading ? "..." : highSeverityCount.toString(), color: "text-orange-500" },
          { title: "Avg Response Time", value: loading ? "..." : avgResponseTime, color: "text-blue-500" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#13151a] p-6 rounded-2xl border border-neutral-800 shadow-xl flex flex-col">
            <span className="text-sm font-medium text-neutral-400 mb-2">{stat.title}</span>
            <span className={`text-4xl font-extrabold tracking-tight ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Main Map & Live Feed Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        
        {/* Left Side: Live Map Area (2/3 width) */}
        <div className="lg:col-span-2 bg-[#13151a] rounded-2xl border border-neutral-800 shadow-xl p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4">Live Incident Map</h2>
          <div className="flex-1 bg-neutral-900 rounded-xl flex items-center justify-center border-2 border-dashed border-neutral-700">
            <span className="text-neutral-500 font-medium">[ Google Maps Component Goes Here ]</span>
          </div>
        </div>

        {/* Right Side: Live SOS Feed (1/3 width) */}
        <div className="bg-[#13151a] rounded-2xl border border-neutral-800 shadow-xl p-6 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Live Operations Feed</h2>
            <span className="flex items-center gap-2 text-xs font-bold text-red-500 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              LIVE
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2 scrollbar-thin scrollbar-thumb-neutral-700">
            {loading ? (
              <p className="text-sm text-neutral-500 text-center mt-10 animate-pulse">Loading communications...</p>
            ) : reports.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center mt-10">No active emergencies.</p>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="p-4 border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 transition-colors rounded-xl flex flex-col gap-2 shadow-sm">
                  
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold px-2 py-1 rounded tracking-wide uppercase ${getBadgeColor(report.status)}`}>
                      {report.status || "Pending"}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      {new Date(report.created_at).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                    <span>📍</span> {report.location || "Location Unknown"}
                  </p>

                  <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3">
                    {report.description}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-red-600/10 text-red-500 border border-red-900/50 text-xs font-bold py-2 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-500 transition-all">
                      Dispatch Unit
                    </button>
                    
                    <Link 
                      href={`/dashboard/sos/${report.id}`} 
                      className="px-4 py-2 flex items-center justify-center bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold rounded-lg hover:bg-neutral-700 transition-all"
                    >
                      Details
                    </Link>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
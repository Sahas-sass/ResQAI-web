"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import "leaflet/dist/leaflet.css";

// Safely import Leaflet elements dynamically to bypass server-side rendering errors
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

interface SOSReport {
  id: string;
  location: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
}

export default function CommandCenterMap() {
  const [reports, setReports] = useState<SOSReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Center the map view over Sri Lanka (Colombo coordinates)
  const mapCenterPosition: [number, number] = [6.9271, 79.8612];

  useEffect(() => {
    // 1. Fetch existing reports with valid coordinates from Supabase
    const fetchActiveIncidents = async () => {
      try {
        const { data, error } = await supabase
          .from("sos_reports")
          .select("*")
          .not("latitude", "is", null)
          .not("longitude", "is", null);

        if (error) throw error;
        
        // Use type assertion (as SOSReport[]) to let TypeScript know the data is safe to map
        if (data) setReports(data as SOSReport[]);
        
      } catch (err) {
        console.error("Error fetching map vectors:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActiveIncidents();

    // 2. Fix for default Leaflet marker assets breaking inside Next.js build bundles
    // This dynamically fixes the missing icon paths at runtime
    const fixLeafletIcons = async () => {
      const L = (await import("leaflet")).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    };
    fixLeafletIcons();
  }, []);

  return (
    <div className="h-screen w-full bg-[#0a0a0c] text-white flex flex-col relative font-sans overflow-hidden">
      
      {/* Cinematic HUD Overlap Header */}
      <header className="absolute top-4 left-4 right-4 z-[1000] bg-[#121216]/80 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 flex justify-between items-center shadow-2xl">
        <div>
          <h1 className="text-lg font-black tracking-widest text-red-500 uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            ResQAI Tactical Stream
          </h1>
          <p className="text-xs text-gray-400">Live Geospatial Command Dashboard</p>
        </div>
        <div className="bg-red-950/40 border border-red-500/30 px-4 py-2 rounded-lg text-xs text-red-400 font-extrabold tracking-wide">
          ACTIVE DISPATCHES: {reports.length}
        </div>
      </header>

      {/* Map Rendering Portal Container */}
      <div className="w-full h-full z-0 relative">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0c] gap-3">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">Booting Grid System...</p>
          </div>
        ) : (
          <MapContainer
            center={mapCenterPosition}
            zoom={12}
            className="w-full h-full"
            zoomControl={false}
          >
            {/* CartoDB Dark Matter Tiles provides the flawless dark theme aesthetic out of the box */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Dynamically map our active incident records into active pins */}
            {reports.map((report) => (
              <Marker 
                key={report.id} 
                position={[report.latitude!, report.longitude!]}
              >
                <Popup>
                  <div className="p-2 text-gray-900 font-sans min-w-[200px]">
                    <div className="flex justify-between items-center mb-1 border-b pb-1 border-gray-100">
                      <span className="text-[10px] font-black uppercase text-red-600">🚨 REPORT PLOTTED</span>
                      <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase">{report.status}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-800 mb-1">{report.location}</p>
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 leading-relaxed max-h-[80px] overflow-y-auto">
                      {report.description}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
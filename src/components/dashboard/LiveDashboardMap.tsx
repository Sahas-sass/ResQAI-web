"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

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

export default function LiveDashboardMap({ reports }: { reports: SOSReport[] }) {
  const [customIcons, setCustomIcons] = useState<any>(null);
  const geocodedReports = reports.filter((r) => r.latitude !== null && r.longitude !== null);

  useEffect(() => {
    const initializeIcons = async () => {
      const L = (await import("leaflet")).default;
      const pulseIcon = new L.DivIcon({
        className: "pulse-marker",
        html: `
          <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: #ef4444; opacity: 0.4; animation: ping 1.5s infinite;"></div>
            <div style="position: relative; width: 12px; height: 12px; border-radius: 50%; background-color: #dc2626; border: 2px solid #ffffff;"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });
      setCustomIcons(pulseIcon);
    };
    initializeIcons();
  }, []);

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden min-h-[380px] flex flex-col">
      {!customIcons ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400 text-xs">Loading grid...</div>
      ) : (
        <MapContainer center={[6.9271, 79.8612]} zoom={11} className="w-full flex-1" zoomControl={true}>
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {geocodedReports.map((report) => (
            <Marker key={report.id} position={[report.latitude!, report.longitude!]} icon={customIcons}>
              <Popup>
                <div className="p-1 text-gray-900 max-w-[200px]">
                  <h4 className="text-xs font-bold">📍 {report.location}</h4>
                  <p className="text-[11px] text-gray-600 mt-1">{report.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


interface SOSReport {
  id: string;
  location: string;
  description: string;
  status: string;
  created_at: string;
  media_urls: string[];
}


export default function IncomingSOS() {

  const [reports, setReports] = useState<SOSReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const router = useRouter();


  useEffect(() => {

    const fetchReports = async () => {

      const { data, error } = await supabase
        .from("sos_reports")
        .select("*")
        .order("created_at", { ascending: false });


      if (!error && data) {
        setReports(data);
      }

      setLoading(false);
    };


    fetchReports();


    const channel = supabase
      .channel("incoming-sos-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sos_reports",
        },
        (payload) => {

          console.log("New SOS:", payload.new);

          setReports((current) => [
            payload.new as SOSReport,
            ...current,
          ]);

        }
      )
      .subscribe();



    return () => {
      supabase.removeChannel(channel);
    };


  }, []);

  useEffect(() => {

  const handleEscape = (event: KeyboardEvent) => {

    if (event.key === "Escape") {
      setSelectedMedia(null);
    }

  };


  window.addEventListener(
    "keydown",
    handleEscape
  );


  return () => {
    window.removeEventListener(
      "keydown",
      handleEscape
    );
  };


}, []);



    return (
    <div className="w-full px-6">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Incoming SOS
          </h1>
          <p className="text-neutral-400 mt-1">
            Live emergency reports from citizens
          </p>
        </div>

        <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          LIVE
        </div>
      </div>



      {loading && (
        <p className="text-neutral-400">
          Loading emergency communications...
        </p>
      )}



      {!loading && reports.length === 0 && (
        <div className="border border-neutral-800 bg-neutral-900 rounded-xl p-8 text-center">
          <p className="text-neutral-400">
            No incoming emergencies.
          </p>
        </div>
      )}



      <div className="space-y-4 px-4">

        {reports.map((report)=>(

          <div
            key={report.id}
            className="
              bg-neutral-950/80
              backdrop-blur-xl
              border border-neutral-800
              rounded-2xl
              p-6
              shadow-lg
              hover:border-red-900
              transition
            "
          >

            {/* Header */}
            <div className="flex justify-between items-start">

              <div className="flex items-center gap-3">

                <div className="
                  w-10 h-10
                  rounded-full
                  bg-red-950
                  flex
                  items-center
                  justify-center
                  text-xl
                ">
                  🚨
                </div>


                <div>
                  <h2 className="text-white font-bold">
                    Emergency Alert
                  </h2>

                  <p className="text-xs text-neutral-500">
                    ID: {report.id.slice(0,8)}
                  </p>
                </div>

              </div>



              <span className="
                bg-red-600/20
                text-red-400
                border border-red-900
                px-3
                py-1
                rounded-full
                text-xs
                font-bold
              ">
                NEW
              </span>

            </div>



            {/* Details */}

            <div className="mt-6 space-y-3">


              <div>
                <p className="text-xs text-neutral-500 uppercase">
                  Location
                </p>

                <p className="text-white font-medium">
                  📍 {report.location}
                </p>
              </div>



              <div>
                <p className="text-xs text-neutral-500 uppercase">
                  Description
                </p>

                <p className="text-neutral-300">
                  {report.description}
                </p>
              </div>



              <p className="text-xs text-neutral-500">
                🕒 {new Date(report.created_at).toLocaleString()}
              </p>


            </div>



            {/* Media Badge */}

            {report.media_urls?.length > 0 && (

            <button
                onClick={() => setSelectedMedia(report.media_urls[0])}
                className="
                mt-5
                inline-flex
                items-center
                gap-2
                bg-green-950/40
                text-green-400
                border
                border-green-900
                px-4
                py-2
                rounded-lg
                text-sm
                font-bold
                hover:bg-green-900/40
                transition
                "
            >
                📸 Evidence Attached
            </button>

            )}


            {/* Action */}

            <div className="mt-6 flex justify-end">

              <button
                onClick={() =>
                  router.push(`/dashboard/dispatch?sosId=${report.id}`)
                }
                className="
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  font-bold
                  px-8
                  py-3
                  rounded-xl
                  transition
                  shadow-lg
                  shadow-red-900/30
                "
              >
                Dispatch →
              </button>

            </div>


          </div>

        ))}

      </div>
        {selectedMedia && (

  <div
    className="
      fixed
      inset-0
      bg-neutral-950/80
      backdrop-blur-sm
      z-50
      flex
      items-center
      justify-center
      p-6
    "
    onClick={() => setSelectedMedia(null)}
  >

    <div
      className="
        relative
        max-w-5xl
        max-h-[90vh]
      "
      onClick={(e)=>e.stopPropagation()}
    >

      <img
        src={selectedMedia}
        alt="Emergency evidence"
        className="
          max-h-[85vh]
          rounded-xl
          shadow-2xl
        "
      />


      <button
        onClick={() => setSelectedMedia(null)}
        className="
          absolute
          -top-4
          -right-4
          bg-red-600
          text-white
          w-10
          h-10
          rounded-full
          font-bold
        "
      >
        ✕
      </button>


    </div>

  </div>

)}
    </div>
  );
}
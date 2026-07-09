import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar"; // <-- Import the new Topbar

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-950">
      
      {/* 1. The Left Sidebar */}
      <Sidebar />

      {/* 2. The Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        
        {/* The New Topbar */}
        <Topbar />
        
        {/* The Page Content (Analytics, Map, etc.) */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
}
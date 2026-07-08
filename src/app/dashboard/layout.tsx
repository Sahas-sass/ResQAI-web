import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content Area - This is where the team will drop their features */}
      <div className="flex-1 flex flex-col">
        {/* Simple Topbar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Command Center</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-resq-red transition">
              🔔
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-resq-red rounded-full border-2 border-white"></span>
            </button>
            <button className="bg-resq-dark text-white px-4 py-2 rounded-md text-sm font-bold">Sign Out</button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
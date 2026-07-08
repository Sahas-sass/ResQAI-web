import Link from "next/link";

export default function Sidebar() {
  const navItems = [
    { name: "Live Crisis Map", icon: "🗺️", path: "/dashboard" },
    { name: "Smart Dispatch", icon: "🚑", path: "/dashboard/dispatch" },
    { name: "Incoming SOS", icon: "🚨", path: "/dashboard/sos" },
    { name: "AI Analytics", icon: "📊", path: "/dashboard/analytics" },
    { name: "Responders", icon: "🧑‍🚒", path: "/dashboard/responders" },
  ];

  return (
    <aside className="w-64 bg-resq-dark h-screen sticky top-0 flex flex-col shadow-2xl border-r border-gray-800">
      {/* Brand / Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-gray-800">
        <div className="w-8 h-8 bg-resq-red rounded-md flex items-center justify-center text-white font-bold mr-3 shadow-lg shadow-resq-red/20">R</div>
        <span className="text-xl font-bold text-white tracking-tight">ResQ<span className="text-resq-red">AI</span></span>
        <span className="ml-2 text-[10px] text-gray-400 uppercase tracking-widest border border-gray-600 rounded px-1">Ops</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Main Menu</p>
        
        {navItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
              index === 0 
                ? "bg-resq-red/10 text-resq-red border border-resq-red/20" 
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Operator Profile Area */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">OP</div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Operator 01</span>
            <span className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Active
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
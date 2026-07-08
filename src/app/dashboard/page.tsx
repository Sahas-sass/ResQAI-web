export default function DashboardHome() {
  return (
    <div className="w-full h-full flex flex-col gap-6">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Active Emergencies", value: "12", color: "text-resq-red" },
          { title: "Available Units", value: "34", color: "text-green-600" },
          { title: "High Severity", value: "3", color: "text-orange-500" },
          { title: "Avg Response Time", value: "8m 42s", color: "text-blue-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <span className="text-sm font-semibold text-gray-500 mb-2">{stat.title}</span>
            <span className={`text-4xl font-extrabold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Main Map & AI Prediction Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Left Side: Live Map Area (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Live Incident Map</h2>
          <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <span className="text-gray-400 font-medium">[ Google Maps Component Goes Here ]</span>
          </div>
        </div>

        {/* Right Side: AI Analytics (1/3 width) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-4">AI Severity Predictions</h2>
          <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <span className="text-gray-400 font-medium text-center px-4">[ Python AI Microservice Data Goes Here ]</span>
          </div>
        </div>
      </div>

    </div>
  );
}
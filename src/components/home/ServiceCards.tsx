import Link from "next/link";

export default function ServiceCards() {
  const services = [
    {
      title: "AI Crisis Triage",
      desc: "Automated NLP severity grading and instant emergency categorization.",
      icon: "🚨",
    },
    {
      title: "Smart Dispatch",
      desc: "Real-time fleet tracking and intelligent responder routing.",
      icon: "🚑",
    },
    {
      title: "Live Threat Map",
      desc: "Dynamic geolocation and active crisis zone monitoring.",
      icon: "🗺️",
    },
    {
      title: "Secure Comms",
      desc: "Encrypted, multi-agency cross-communication channels.",
      icon: "📡",
    },
    {
      title: "Resource Control",
      desc: "Live inventory, hospital beds, and personnel allocation.",
      icon: "🛡️",
    },
  ];

  return (
    // The negative top margin (-mt-24) pulls this section up to overlap the Hero section
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 mb-24">
      
      {/* The White Container with light gray dividers */}
      <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 overflow-hidden">
        
        {services.map((service, idx) => (
          <div 
            key={idx} 
            className="group relative flex flex-col items-center text-center p-8 bg-white hover:bg-gray-50 transition-colors duration-300"
          >
            {/* Soft Red Icon Circle */}
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
              {service.icon}
            </div>

            {/* Dark Typography for High Contrast */}
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {service.title}
            </h3>
            
            <p className="text-sm text-gray-500 leading-relaxed mb-8 flex-grow">
              {service.desc}
            </p>

            {/* The subtle gray arrow that turns red on hover */}
            <Link 
              href="/report" 
              className="mt-auto text-gray-300 group-hover:text-red-600 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        ))}

      </div>
    </section>
  );
}
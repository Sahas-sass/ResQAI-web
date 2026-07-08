import Link from "next/link";

export default function ServiceCards() {
  const services = [
    {
      icon: "🚨", // Placeholder for actual SVG/icons
      title: "Patient Transport Services",
      description: "Lorem ipsum dolor sit a et, consectetur adi pisc elit m ipsum doamet.",
    },
    {
      icon: "📞",
      title: "Event Medical Cover Service",
      description: "Access our network of consultants to find the specialist that's right for you.",
    },
    {
      icon: "🩸",
      title: "Repatriation Services",
      description: "Consultants to find the specialist that's right for you here in everyday.",
    },
    {
      icon: "🚑",
      title: "Ambulance Available 24/7",
      description: "To exchange practical advice and experience in implementing admission avoidance.",
    },
    {
      icon: "🧑‍🚒",
      title: "Volunteer Help Services",
      description: "To integrate H&H services with specialty services on the platform.",
    }
  ];

  return (
    <section className="relative z-30 w-full max-w-7xl mx-auto px-10 -mt-20">
      <div className="grid grid-cols-1 md:grid-cols-5 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden border border-resq-gray/50 backdrop-blur-sm">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center text-center p-8 border-r last:border-r-0 border-gray-100 hover:bg-gray-50 transition-colors duration-300 group"
          >
            {/* Icon Circle */}
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {service.icon}
            </div>
            
            {/* Text Content */}
            <h3 className="text-resq-text font-bold text-sm mb-3 h-10 flex items-center justify-center">
              {service.title}
            </h3>
            <p className="text-gray-500 text-xs mb-6 leading-relaxed">
              {service.description}
            </p>
            
            {/* Arrow Link */}
            <Link href="#" className="mt-auto text-gray-300 group-hover:text-resq-red transition-colors duration-300">
              ➔
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
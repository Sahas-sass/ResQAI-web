import Image from "next/image";

export default function AboutSection() {
  const features = [
    "Sub-second AI threat assessment",
    "Cross-agency data synchronization",
    "Automated SOS dispatch routing",
    "Real-time fleet & asset tracking",
    "Predictive crisis zone mapping",
    "Encrypted multi-channel comms",
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-10 py-24 flex flex-col lg:flex-row items-center gap-16">
      
      {/* Left Side: Image Collage */}
      <div className="w-full lg:w-1/2 relative h-[500px]">
        {/* Main large image - Command Center / Operations */}
        <div className="absolute top-0 left-0 w-4/5 h-4/5 rounded-lg overflow-hidden border-4 border-white shadow-xl bg-gray-100">
          <Image 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
            alt="Tactical Command Center" 
            fill 
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        {/* Overlapping smaller image - Active Responders */}
        <div className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-lg overflow-hidden border-4 border-white shadow-xl bg-gray-100 z-10">
          <Image 
            src="https://images.unsplash.com/photo-1712159018726-4564d92f3ec2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Multi-Agency Responders" 
            fill 
            sizes="(max-width: 1024px) 100vw, 30vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Side: Text Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-start">
        <h4 className="text-gray-500 font-bold text-xs tracking-[0.2em] uppercase mb-4">
          Welcome to ResQAI Platform
        </h4>
        <h2 className="text-gray-900 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-6">
          AI-Powered Coordination for a population of 4.8 Million People.
        </h2>
        <p className="text-gray-500 leading-relaxed mb-8">
          Emergency response systems often remain fragmented and slow during critical situations. ResQAI centralizes these operations, using artificial intelligence to instantly analyze incoming threat data and route multi-agency resources where they are needed most.
        </p>

        {/* Feature Checkmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="min-w-5 w-5 h-5 rounded-full border border-red-600 flex items-center justify-center text-red-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-600 text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
}
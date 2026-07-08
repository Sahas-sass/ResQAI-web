import Image from "next/image";

export default function AboutSection() {
  const features = [
    "Approved resource with a vision",
    "Approved resource with a vision",
    "Well placed for rapid response",
    "Well placed for rapid response",
    "A cost-effective and consistent",
    "A cost-effective and consistent",
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-10 py-24 flex flex-col lg:flex-row items-center gap-16">
      
      {/* Left Side: Image Collage */}
      <div className="w-full lg:w-1/2 relative h-[500px]">
        {/* Main large image */}
        <div className="absolute top-0 left-0 w-4/5 h-4/5 rounded-lg overflow-hidden border-4 border-white shadow-xl bg-gray-100">
          <Image 
            src="https://images.unsplash.com/photo-1516841273335-e39b37888115?q=80&w=800&auto=format&fit=crop" 
            alt="Emergency Loading" 
            fill 
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        {/* Overlapping smaller image */}
        <div className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-lg overflow-hidden border-4 border-white shadow-xl bg-gray-100 z-10">
          <Image 
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop" 
            alt="Paramedic Action" 
            fill 
            sizes="(max-width: 1024px) 100vw, 30vw"
            className="object-cover"
          />
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute bottom-10 right-1/4 w-16 h-16 bg-resq-red rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform z-20">
          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4l12 6-12 6z" />
          </svg>
        </div>
      </div>

      {/* Right Side: Text Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-start">
        <h4 className="text-gray-500 font-bold text-xs tracking-[0.2em] uppercase mb-4">
          Welcome to ResQAI Platform
        </h4>
        <h2 className="text-resq-text text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-6">
          AI-Powered Coordination for a population of 4.8 Million People.
        </h2>
        <p className="text-gray-500 leading-relaxed mb-8">
          Emergency response systems often remain fragmented and slow during critical situations. ResQAI centralizes these operations, using artificial intelligence to instantly analyze and route resources where they are needed most.
        </p>

        {/* Feature Checkmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="min-w-5 w-5 h-5 rounded-full border border-resq-red flex items-center justify-center text-resq-red">
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
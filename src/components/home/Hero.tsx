export default function Hero() {
  return (
    <section className="relative w-full h-[600px] bg-resq-dark flex items-center overflow-hidden">
      
      {/* The Angled Red Background overlay */}
      <div className="absolute top-0 right-0 w-3/4 h-full bg-resq-red transform origin-bottom-right -skew-x-12 translate-x-32"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left Side: Text Content */}
        <div className="w-full md:w-1/2 text-white flex flex-col items-start gap-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Providing Quality <br /> Transportation
          </h1>
          <p className="text-gray-300 text-lg max-w-md">
            Medical Ambulance we consider it a privilege to provide transportation services.
          </p>
          <button className="bg-resq-red text-white px-8 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-white hover:text-resq-red transition duration-300 shadow-lg">
            Discover Services
          </button>
        </div>

        {/* Right Side: Image Placeholder */}
        <div className="w-full md:w-1/2 flex justify-end mt-10 md:mt-0 relative z-20">
          {/* Replace this div with an actual <img /> tag when you have the ambulance asset */}
          <div className="w-[500px] h-[300px] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white/50 shadow-2xl">
            [Ambulance Image / 3D Render Placeholder]
          </div>
        </div>

      </div>
    </section>
  );
}
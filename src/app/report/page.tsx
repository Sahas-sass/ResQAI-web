import Link from "next/link";

export default function SOSReport() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-12 px-4 relative">
      
      {/* Background Warning Banner */}
      <div className="absolute top-0 w-full bg-resq-red text-white text-center py-2 text-xs font-bold uppercase tracking-widest z-0">
        Official ResQAI Emergency Reporting Portal
      </div>

      <div className="relative z-10 w-full max-w-2xl mt-8">
        {/* Header / Language Selector */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-resq-dark transition">
            ← Back to Home
          </Link>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-resq-red shadow-sm">ENG</button>
            <button className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-bold text-gray-400 hover:text-gray-600 transition">සිංහල</button>
            <button className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-bold text-gray-400 hover:text-gray-600 transition">தமிழ்</button>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-8 flex flex-col gap-8">
          
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-resq-dark tracking-tight mb-2">Report an Emergency</h1>
            <p className="text-gray-500 text-sm">Please provide accurate details. Our AI will automatically prioritize your request.</p>
          </div>

          <form className="flex flex-col gap-6">
            
            {/* Step 1: Location */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <label className="block text-sm font-bold text-resq-dark mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-resq-dark text-white rounded-full flex items-center justify-center text-xs">1</span>
                Incident Location
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Searching for GPS signal..." 
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-resq-red transition"
                  disabled
                />
                <button type="button" className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-bold text-sm hover:bg-gray-300 transition">
                  📍 Locate Me
                </button>
              </div>
            </div>

            {/* Step 2: Details */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <label className="block text-sm font-bold text-resq-dark mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-resq-dark text-white rounded-full flex items-center justify-center text-xs">2</span>
                Describe the Situation
              </label>
              <textarea 
                rows={4}
                placeholder="E.g., Two-vehicle collision, someone is trapped..." 
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-resq-red transition resize-none"
              ></textarea>
            </div>

            {/* Step 3: Media Upload */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <label className="block text-sm font-bold text-resq-dark mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-resq-dark text-white rounded-full flex items-center justify-center text-xs">3</span>
                Upload Photos/Audio (Optional)
              </label>
              <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition cursor-pointer">
                <span className="text-2xl mb-2">📸</span>
                <span className="text-sm font-semibold text-gray-500">Tap to upload images or voice notes</span>
              </div>
            </div>

            {/* Submit */}
            <button 
              type="button" 
              className="w-full bg-resq-red text-white font-extrabold text-lg rounded-xl px-4 py-5 hover:bg-resq-darkRed transition-colors shadow-xl shadow-resq-red/20 mt-4 flex items-center justify-center gap-2"
            >
              🚨 DISPATCH EMERGENCY SOS
            </button>
            <p className="text-center text-xs text-gray-400 font-medium">
              False reporting is a punishable offense under Sri Lankan law.
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
import Link from "next/link";

export default function Register() {
  return (
    <div className="min-h-screen w-full bg-resq-dark flex items-center justify-center relative overflow-hidden py-10">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-resq-red/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-resq-red/10 rounded-full blur-[100px]"></div>

      {/* Glassmorphism Registration Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col mt-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-resq-red rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-resq-red/30">R</div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Request Access</h2>
          <p className="text-gray-400 text-sm mt-2">Register as a ResQAI Operator or Responder</p>
        </div>

        {/* Registration Form */}
        <form className="flex flex-col gap-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                placeholder="Jane Doe" 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-resq-red transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Badge / ID Number</label>
              <input 
                type="text" 
                placeholder="OP-7742" 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-resq-red transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Official Email Address</label>
            <input 
              type="email" 
              placeholder="jane.doe@resqai.lk" 
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-resq-red transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-resq-red transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-resq-red transition-colors"
              />
            </div>
          </div>

          <div className="mt-4">
            <button 
              type="button" 
              className="w-full bg-resq-red text-white font-bold rounded-lg px-4 py-3 hover:bg-resq-darkRed transition-colors shadow-lg shadow-resq-red/20"
            >
              Submit Registration
            </button>
          </div>

          <div className="text-center mt-2">
            <p className="text-sm text-gray-400">
              Already have an account? <Link href="/login" className="text-resq-red hover:text-white transition-colors font-medium">Log in here</Link>
            </p>
          </div>
        </form>
      </div>
      
    </div>
  );
}
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex flex-col shadow-md font-sans">
      
      {/* Top Tier: Brand & Action Links */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 bg-white">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#e60000] rounded-full flex items-center justify-center text-white font-bold text-lg">
            R
          </div>
          <span className="text-2xl font-bold text-black tracking-tight">
            ResQ<span className="text-[#e60000]">AI</span>
          </span>
        </Link>

        {/* Action Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <button className="flex items-center gap-2 hover:text-[#e60000] transition">
            <span className="text-blue-500 text-lg">🔍</span> Search Now
          </button>
          
          {/* Linked securely to our new Operator Authentication flow */}
          <Link href="/login" className="flex items-center gap-2 hover:text-[#e60000] transition">
            <span className="text-gray-400 text-lg">📄</span> Operator Login
          </Link>
          
          <Link href="#contact" className="flex items-center gap-2 hover:text-[#e60000] transition">
            <span className="text-pink-600 text-lg">📞</span> Contact Us
          </Link>
          
          {/* Linked directly to the public SOS form we built */}
          <Link href="/report">
            <button className="bg-[#e60000] text-white font-bold py-2.5 px-6 rounded-full hover:bg-red-800 transition shadow-sm">
              Emergency SOS
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom Tier: Main Navigation */}
      <div className="bg-[#e60000] flex items-center justify-between px-4 md:px-8 py-3 text-white text-sm font-bold uppercase tracking-wide">
        
        <nav className="flex gap-6 md:gap-8">
          <Link href="/" className="hover:text-gray-200 transition">Home</Link>
          <Link href="#about" className="hover:text-gray-200 transition">About</Link>
          <Link href="#services" className="hover:text-gray-200 transition">Services</Link>
          <Link href="#contact" className="hover:text-gray-200 transition">Contact</Link>
        </nav>

        <div className="flex items-center gap-2 text-base font-extrabold tracking-wider">
          <span className="text-pink-300">📞</span> Hotline: 119
        </div>
        
      </div>
    </header>
  );
}
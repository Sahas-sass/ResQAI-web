import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full flex flex-col font-sans">
      {/* Top Utility Bar */}
      <div className="w-full bg-white flex justify-between items-center px-10 py-4">
        {/* Logo Placeholder */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-resq-red rounded-full flex items-center justify-center text-white font-bold">R</div>
          <span className="text-2xl font-bold text-resq-dark tracking-tight">ResQ<span className="text-resq-red">AI</span></span>
        </div>

        {/* Utility Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-resq-text">
          <Link href="#" className="flex items-center gap-1 hover:text-resq-red transition">🔍 Search Now</Link>
          <Link href="#" className="flex items-center gap-1 hover:text-resq-red transition">📄 Operator Login</Link>
          <Link href="#" className="flex items-center gap-1 hover:text-resq-red transition">📞 Contact Us</Link>
          
          <button className="bg-resq-red text-white px-6 py-2 rounded-full font-bold hover:bg-resq-darkRed transition">
            Emergency SOS
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      {/* Note: We use a skewed div for the angled red background effect seen in the design */}
      <div className="relative w-full bg-resq-red text-white flex justify-between items-center px-10 py-4">
        <nav className="flex gap-8 text-sm font-bold uppercase tracking-wide z-10">
          <Link href="/" className="hover:text-gray-300 transition">Home</Link>
          <Link href="/about" className="hover:text-gray-300 transition">About</Link>
          <Link href="/services" className="hover:text-gray-300 transition">Services</Link>
          <Link href="/contact" className="hover:text-gray-300 transition">Contact</Link>
        </nav>

        <div className="z-10 font-bold flex items-center gap-2">
          <span>📞 Hotline: 119</span>
        </div>
      </div>
    </header>
  );
}
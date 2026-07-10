"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const slides = [
    {
      id: "medical",
      title: "Medical Corps",
      url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "police",
      title: "Law Enforcement",
      url: "https://images.unsplash.com/photo-1453873531674-2151bcd01707?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "fire",
      title: "Fire & Rescue",
      url: "https://images.unsplash.com/photo-1576707995936-a6cffe26ef7b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "army",
      title: "Defense Operations",
      url: "https://images.unsplash.com/photo-1596144086603-679a540a2b28?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative py-24 lg:py-32 bg-red-600 flex items-center overflow-hidden">
      
      {/* The Diagonal Dark Background (Left Side) */}
      <div 
        className="absolute inset-y-0 left-0 w-full lg:w-[65%] bg-[#13151a] z-0"
        style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 lg:px-12 mt-12">
        
        {/* Left Side: Typography & Button */}
        <div className="space-y-6 max-w-lg">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Unified Tactical <br />
            Operations
          </h1>
          
          <p className="text-neutral-300 text-lg leading-relaxed">
            Synchronizing Medical, Police, Fire, and Defense forces. We consider it a privilege to coordinate multi-agency emergency responses.
          </p>
          
          <div className="pt-4">
            <Link 
              href="/report" 
              className="inline-block px-8 py-3.5 font-bold text-white bg-red-600 rounded-full hover:bg-red-700 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Discover Services
            </Link>
          </div>
        </div>

        {/* Right Side: The Image Carousel Card */}
        <div className="relative flex justify-end items-center">
          
          <div className="relative w-full max-w-[600px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-neutral-900">
            
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={slide.url}
                  alt={slide.title}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
                
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-20">
                  <p className="text-white font-bold text-xl tracking-wide">{slide.title}</p>
                </div>
              </div>
            ))}

          </div>

          {/* Carousel Button */}
          <button 
            onClick={nextSlide}
            className="absolute -right-5 z-20 w-12 h-12 bg-neutral-950 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-neutral-800 hover:bg-neutral-800 hover:scale-110 transition-all cursor-pointer"
            aria-label="Next Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

        </div>
      </div>
    </section>
  );
}
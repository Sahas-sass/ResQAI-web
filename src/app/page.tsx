import Hero from "@/components/home/Hero";
import ServiceCards from "@/components/home/ServiceCards";
import AboutSection from "@/components/home/AboutSection";

export default function Home() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Hero />
      <ServiceCards />
      <AboutSection />
    </div>
  );
}
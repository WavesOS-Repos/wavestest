import { Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = (clientX: number, clientY: number) => {
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate relative position (-1 to 1)
        const relativeX = (clientX - centerX) / (rect.width / 2);
        const relativeY = (clientY - centerY) / (rect.height / 2);
        
        setMousePosition({ x: relativeX, y: relativeY });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleDownloadClick = () => {
    const downloadsSection = document.getElementById("downloads");
    if (downloadsSection) {
      downloadsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div className="absolute inset-0 grid-overlay opacity-30"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-float">
          <div className="flex flex-col items-center mb-6">
            <div 
              ref={logoRef}
              className="w-72 h-72 md:w-[28rem] md:h-[28rem] mb-4 cursor-pointer relative"
              style={{
                perspective: '1200px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Static ambient glow layer - stays in place */}
              <div
                className="absolute inset-0 w-full h-full rounded-lg"
                style={{
                  background: `
                    radial-gradient(
                      ellipse at center,
                      rgba(147, 51, 234, 0.3) 0%,
                      rgba(59, 130, 246, 0.2) 40%,
                      rgba(34, 197, 94, 0.1) 70%,
                      transparent 100%
                    )
                  `,
                  filter: 'blur(20px)',
                }}
              />
              
              <div
                className="relative w-full h-full"
                style={{
                  transform: `
                    rotateY(${mousePosition.x * 30}deg) 
                    rotateX(${-mousePosition.y * 30}deg)
                  `,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.1s ease-out',
                }}
              >
                {/* Create multiple layers with equal spacing for true 3D depth */}
                {Array.from({ length: 30 }, (_, i) => {
                  const layerDepth = 30 - i; // Front layer at 30, back layer at 1
                  const zPosition = layerDepth * 3; // Equal 3px spacing between layers
                  const opacity = 0.7 + (layerDepth / 30) * 0.3; // Gradual opacity from back to front
                  const brightness = 0.5 + (layerDepth / 30) * 0.5; // Gradual brightness from back to front
                  
                  return (
                    <img
                      key={i}
                      src="/logo.png"
                      alt="WavesOS Logo"
                      className="absolute inset-0 w-full h-full object-contain"
                      style={{
                        transform: `translateZ(${zPosition}px)`,
                        opacity: opacity,
                        filter: `
                          brightness(${brightness})
                          hue-rotate(${(30 - layerDepth) * 6}deg)
                          drop-shadow(0 0 ${10 + layerDepth}px rgba(147, 51, 234, ${0.1 + layerDepth * 0.01}))
                          ${layerDepth === 30 ? `
                            drop-shadow(${mousePosition.x * 12}px ${mousePosition.y * 12}px 25px rgba(147, 51, 234, 0.5))
                            drop-shadow(${-mousePosition.x * 6}px ${-mousePosition.y * 6}px 15px rgba(59, 130, 246, 0.3))
                            drop-shadow(0 0 30px rgba(34, 197, 94, 0.2))
                            contrast(1.1)
                          ` : ''}
                        `,
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <h1 className="font-orbitron font-black text-6xl md:text-8xl gradient-text" data-testid="hero-title">
              WavesOS
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto" data-testid="hero-description">
            Experience the future of computing with our custom Arch-based Linux distribution. 
            Engineered for performance, designed for the next generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleDownloadClick}
              className="cyber-glow bg-cyber-purple/20 border border-purple-500 px-8 py-4 rounded-lg font-semibold hover:bg-cyber-purple/30 transition-all duration-300 text-white"
              data-testid="hero-download-button"
            >
              <Download className="mr-2 w-4 h-4" />
              Download Now
            </Button>
            <Button 
              variant="outline"
              className="border border-gray-600 px-8 py-4 rounded-lg font-semibold hover:border-purple-500 hover:text-purple-400 transition-all duration-300 bg-transparent"
              data-testid="hero-demo-button"
            >
              <Play className="mr-2 w-4 h-4" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
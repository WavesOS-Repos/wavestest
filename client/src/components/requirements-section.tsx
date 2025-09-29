import { AlertTriangle, Star } from "lucide-react";

const minimumRequirements = [
  { label: "Processor", value: "64-bit x86_64" },
  { label: "Memory", value: "4 GB RAM" },
  { label: "Storage", value: "20 GB free space" },
  { label: "Graphics", value: "OpenGL 3.3 support" },
  { label: "Network", value: "Internet connection" },
  { label: "Boot", value: "UEFI or Legacy BIOS" },
];

const recommendedRequirements = [
  { label: "Processor", value: "Multi-core 64-bit x86_64" },
  { label: "Memory", value: "8 GB RAM or more" },
  { label: "Storage", value: "50 GB SSD" },
  { label: "Graphics", value: "Dedicated GPU" },
  { label: "Network", value: "Broadband connection" },
  { label: "Boot", value: "UEFI with Secure Boot" },
];

export default function RequirementsSection() {
  return (
    <section id="requirements" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 gradient-text" data-testid="requirements-title">
            System Requirements
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" data-testid="requirements-description">
            Ensure your system meets the requirements for optimal WavesOS performance
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Minimum Requirements */}
          <div className="cyber-glow bg-gradient-to-br from-red-600/10 to-red-900/5 border border-red-500/20 rounded-2xl p-8" data-testid="minimum-requirements">
            <h3 className="font-orbitron font-bold text-2xl mb-6 text-red-300 flex items-center">
              <AlertTriangle className="mr-3 w-6 h-6" />
              Minimum Requirements
            </h3>
            <div className="space-y-4">
              {minimumRequirements.map((req, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-400">{req.label}:</span>
                  <span className="text-gray-200">{req.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Requirements */}
          <div className="cyber-glow bg-gradient-to-br from-green-600/10 to-green-900/5 border border-green-500/20 rounded-2xl p-8" data-testid="recommended-requirements">
            <h3 className="font-orbitron font-bold text-2xl mb-6 text-green-300 flex items-center">
              <Star className="mr-3 w-6 h-6" />
              Recommended
            </h3>
            <div className="space-y-4">
              {recommendedRequirements.map((req, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-400">{req.label}:</span>
                  <span className="text-gray-200">{req.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

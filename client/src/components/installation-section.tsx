import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const installationSteps = [
  {
    number: 1,
    title: "Download & Create bootable media",
    description: "Download the WavesOS ISO or WavesWrapper from the downloads section and create bootable disk image through balena-etcher or rufus.",
    code: "https://etcher.balena.io/ OR https://rufus.ie/en/",
    color: "purple",
  },
  {
    number: 2,
    title: "Boot through USB drive",
    description: "Boot through the USB drive.",
    code: "Enter the BIOS and boot through the USB Drive",
    color: "cyan",
  },
  {
    number: 3,
    title: "Boot & Install",
    description: "Press SUPER+ENTER and the installer will be started, select all the options carefully and wait for installation",
    badges: ["UEFI Recommended", "Automatic GPU Drivers"],
    color: "green",
  },
  {
    number: 4,
    title: "User Configuration",
    description: "Complete the initial setup wizard, create your user account, and customize your desktop environment.",
    badges: ["Auto Updates", "Theme Selection"],
    color: "orange",
  },
];

const colorVariants = {
  purple: {
    bg: "bg-gradient-to-r from-purple-600/10 to-transparent",
    border: "border-purple-500/20",
    button: "bg-purple-600",
    text: "text-purple-300",
  },
  cyan: {
    bg: "bg-gradient-to-r from-cyan-600/10 to-transparent",
    border: "border-cyan-500/20",
    button: "bg-cyan-600",
    text: "text-cyan-300",
  },
  green: {
    bg: "bg-gradient-to-r from-green-600/10 to-transparent",
    border: "border-green-500/20",
    button: "bg-green-600",
    text: "text-green-300",
  },
  orange: {
    bg: "bg-gradient-to-r from-orange-600/10 to-transparent",
    border: "border-orange-500/20",
    button: "bg-orange-600",
    text: "text-orange-300",
  },
};

export default function InstallationSection() {
  return (
    <section id="installation" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 gradient-text" data-testid="installation-title">
            Installation Guide
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" data-testid="installation-description">
            Follow these steps to install WavesOS on your system
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {installationSteps.map((step, index) => {
              const colors = colorVariants[step.color as keyof typeof colorVariants];
              
              return (
                <div
                  key={index}
                  className={`cyber-glow ${colors.bg} border ${colors.border} rounded-xl p-6 flex items-start space-x-4`}
                  data-testid={`installation-step-${step.number}`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 ${colors.button} rounded-full flex items-center justify-center font-orbitron font-bold text-xl`}>
                    {step.number}
                  </div>
                  <div>
                    <h3 className={`font-orbitron font-bold text-xl mb-2 ${colors.text}`}>
                      {step.title}
                    </h3>
                    <p className="text-gray-400 mb-3">{step.description}</p>
                    {step.code && (
                      <code className="bg-gray-800 px-3 py-1 rounded text-sm text-cyan-400 block mb-3">
                        {step.code}
                      </code>
                    )}
                    {step.badges && (
                      <div className="text-sm text-gray-500">
                        {step.badges.map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className="inline-block bg-gray-800 px-2 py-1 rounded mr-2"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-6" data-testid="installation-help">
              <h4 className="font-orbitron font-bold text-lg mb-3 text-blue-300 flex items-center justify-center">
                <Info className="mr-2 w-5 h-5" />
                Need Help?
              </h4>
              <p className="text-gray-400 mb-4">Check our comprehensive documentation or join our community for support</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg transition-colors duration-300" data-testid="button-documentation">
                  Documentation
                </Button>
                <Button variant="outline" className="border border-blue-500 hover:bg-blue-600/20 px-6 py-2 rounded-lg transition-colors duration-300" data-testid="button-community">
                  Community Forum
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

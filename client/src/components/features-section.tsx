import { Rocket, Shield, Settings, Cloud, Code, Zap } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Ultra Performance",
    description: "Optimized kernel and system configuration for maximum speed and efficiency",
    color: "red",
  },
  {
    icon: Shield,
    title: "Enhanced Security",
    description: "Built-in security hardening and privacy protection out of the box",
    color: "blue",
  },
  {
    icon: Settings,
    title: "Customizable",
    description: "Fully customizable environment with pre-configured development tools",
    color: "green",
  },
  {
    icon: Cloud,
    title: "Cloud Ready",
    description: "Seamless integration with cloud services and container technologies",
    color: "purple",
  },
  {
    icon: Code,
    title: "Developer Focused",
    description: "Complete development environment with modern tools and frameworks",
    color: "cyan",
  },
  {
    icon: Zap,
    title: "Rolling Release",
    description: "Always up-to-date with the latest software and security patches",
    color: "orange",
  },
];

const colorVariants = {
  red: {
    bg: "bg-gradient-to-br from-cyber-red/10 to-cyber-red/5",
    border: "border-red-500/20 hover:border-red-500/40",
    text: "text-red-300",
    icon: "text-red-400",
  },
  blue: {
    bg: "bg-gradient-to-br from-cyber-blue/10 to-cyber-blue/5",
    border: "border-blue-500/20 hover:border-blue-500/40",
    text: "text-blue-300",
    icon: "text-blue-400",
  },
  green: {
    bg: "bg-gradient-to-br from-cyber-green/10 to-cyber-green/5",
    border: "border-green-500/20 hover:border-green-500/40",
    text: "text-green-300",
    icon: "text-green-400",
  },
  purple: {
    bg: "bg-gradient-to-br from-cyber-purple/10 to-cyber-purple/5",
    border: "border-purple-500/20 hover:border-purple-500/40",
    text: "text-purple-300",
    icon: "text-purple-400",
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-600/10 to-cyan-600/5",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    text: "text-cyan-300",
    icon: "text-cyan-400",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-600/10 to-orange-600/5",
    border: "border-orange-500/20 hover:border-orange-500/40",
    text: "text-orange-300",
    icon: "text-orange-400",
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 gradient-text" data-testid="features-title">
            Revolutionary Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" data-testid="features-description">
            Built on Arch Linux with cutting-edge enhancements for the modern user
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorVariants[feature.color as keyof typeof colorVariants];
            
            return (
              <div
                key={index}
                className={`cyber-glow ${colors.bg} border ${colors.border} rounded-xl p-6 transition-all duration-300`}
                data-testid={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`${colors.icon} text-3xl mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className={`font-orbitron font-bold text-xl mb-3 ${colors.text}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

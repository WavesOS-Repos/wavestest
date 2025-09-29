import { Twitter, Github, MessageSquare } from "lucide-react";
import { SiReddit } from "react-icons/si";

export default function Footer() {
  const socialLinks = [
    { icon: Twitter, href: "https://x.com/TarangVer", label: "Twitter" },
    { icon: Github, href: "https://github.com/WavesOS-Repos", label: "GitHub" },
    { icon: MessageSquare, href: "https://discord.gg/ewvfRs4Jrt", label: "Discord" },
    { icon: SiReddit, href: "https://reddit.com/r/wavesos", label: "Reddit" },
  ];

  return (
    <footer className="py-12 border-t border-gray-800" data-testid="footer">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="flex flex-col items-center mb-4" data-testid="footer-logo">
            <img 
              src="/logo.png" 
              alt="WavesOS Logo" 
              className="w-32 h-32 object-contain mb-2"
            />
            <div className="font-orbitron font-bold text-2xl gradient-text">
              WavesOS
            </div>
          </div>
          <p className="text-gray-500 mb-6" data-testid="footer-tagline">
            The future of computing, today.
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-purple-400 transition-colors duration-300"
                  aria-label={link.label}
                  data-testid={`social-${link.label.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
          <div className="text-sm text-gray-600">
            <p data-testid="footer-copyright">
              &copy; 2024 WavesOS Project. All rights reserved.
            </p>
            <p className="mt-2" data-testid="footer-message">
              Built with passion for the open source community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
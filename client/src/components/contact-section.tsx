import { useState } from "react";
import { MessageSquare, Github, Mail, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ContactSection() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await apiRequest("POST", "/api/newsletter/subscribe", {
        email,
      });
      const data = await response.json();

      toast({
        title: "Subscribed Successfully",
        description: "You've been added to our newsletter!",
      });

      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "An error occurred while subscribing",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const contactOptions = [
    {
      icon: MessageSquare,
      title: "Discord Community",
      description:
        "Join our active Discord server for real-time support and discussions",
      buttonText: "Join Discord",
      color: "purple",
    },
    {
      icon: Github,
      title: "GitHub Repository",
      description:
        "Contribute to the project, report issues, and access source code",
      buttonText: "View on GitHub",
      color: "cyan",
    },
    {
      icon: MessageCircle,
      title: "Reddit Community",
      description:
        "Join our Reddit community for discussions and community support",
      buttonText: "Visit Reddit",
      color: "green",
    },
  ];

  const colorVariants = {
    purple: {
      bg: "bg-gradient-to-br from-purple-600/10 to-purple-900/5",
      border: "border-purple-500/20",
      button: "bg-purple-600 hover:bg-purple-500",
      text: "text-purple-300",
      icon: "text-purple-400",
    },
    cyan: {
      bg: "bg-gradient-to-br from-cyan-600/10 to-cyan-900/5",
      border: "border-cyan-500/20",
      button: "bg-cyan-600 hover:bg-cyan-500",
      text: "text-cyan-300",
      icon: "text-cyan-400",
    },
    green: {
      bg: "bg-gradient-to-br from-green-600/10 to-green-900/5",
      border: "border-green-500/20",
      button: "bg-green-600 hover:bg-green-500",
      text: "text-green-300",
      icon: "text-green-400",
    },
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="font-orbitron font-bold text-4xl md:text-5xl mb-6 gradient-text"
            data-testid="contact-title"
          >
            Get In Touch
          </h2>
          <p
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            data-testid="contact-description"
          >
            Join our community and get support for your WavesOS journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            const colors =
              colorVariants[option.color as keyof typeof colorVariants];

            return (
              <div
                key={index}
                className={`cyber-glow ${colors.bg} border ${colors.border} rounded-2xl p-8 text-center`}
                data-testid={`contact-card-${option.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`${colors.icon} text-4xl mb-4`}>
                  <Icon className="w-10 h-10 mx-auto" />
                </div>
                <h3
                  className={`font-orbitron font-bold text-xl mb-3 ${colors.text}`}
                >
                  {option.title}
                </h3>
                <p className="text-gray-400 mb-6">{option.description}</p>
                <Button
                  className={`${colors.button} px-6 py-3 rounded-lg transition-colors duration-300 w-full`}
                  data-testid={`button-${option.title.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => {
                    if (option.title === "Discord Community") {
                      window.open("https://discord.gg/hxTAz9ae", "_blank");
                    } else if (option.title === "GitHub Repository") {
                      window.open("https://github.com/WavesOS-Repos", "_blank");
                    } else if (option.title === "Reddit Community") {
                      window.open("https://www.reddit.com/r/WavesOS/", "_blank");
                    }
                  }}
                >
                  {option.buttonText}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 max-w-2xl mx-auto"
            data-testid="newsletter-section"
          >
            <h4 className="font-orbitron font-bold text-2xl mb-4">
              Stay Updated
            </h4>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for the latest updates and releases
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:border-purple-500 focus:outline-none"
                data-testid="input-newsletter-email"
              />
              <Button
                type="submit"
                disabled={isSubscribing}
                className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
                data-testid="button-newsletter-subscribe"
              >
                {isSubscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
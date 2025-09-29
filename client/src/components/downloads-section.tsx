import { useState } from "react";
import { HardDrive, Archive, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function DownloadsSection() {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = async (type: 'iso' | 'wrapper') => {
    setIsDownloading(type);
    
    try {
      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = `/api/download/${type}`;
      link.download = ''; // Let the server determine the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `File download has been initiated`,
      });
      
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "An error occurred while downloading the file",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <section id="downloads" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 gradient-text" data-testid="downloads-title">
            Download WavesOS
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" data-testid="downloads-description">
            Choose your installation method and start your journey into the future
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* WavesOS ISO Download */}
          <div className="cyber-glow bg-gradient-to-br from-purple-600/20 to-purple-900/10 border border-purple-500/30 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all duration-300" data-testid="download-iso-card">
            <div className="text-purple-400 text-6xl mb-6">
              <HardDrive className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="font-orbitron font-bold text-2xl mb-4 text-purple-300" data-testid="iso-title">
              WavesOS ISO
            </h3>
            <p className="text-gray-400 mb-6" data-testid="iso-description">
              Complete installation image with all core components and desktop environment
            </p>
            <div className="text-sm text-gray-500 mb-6">
              <div>Size: ~4.0 GB</div>
              <div>Format: ISO Image</div>
              <div>Version: 2025</div>
            </div>
            <Button 
              onClick={() => handleDownload('iso')}
              disabled={isDownloading === 'iso'}
              className="w-full bg-purple-600 hover:bg-purple-500 border border-purple-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
              data-testid="button-download-iso"
            >
              {isDownloading === 'iso' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 w-4 h-4" />
                  Download ISO
                </>
              )}
            </Button>
          </div>

          {/* WavesWrapper Download */}
          <div className="cyber-glow bg-gradient-to-br from-cyan-600/20 to-cyan-900/10 border border-cyan-500/30 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-all duration-300" data-testid="download-wrapper-card">
            <div className="text-cyan-400 text-6xl mb-6">
              <Archive className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="font-orbitron font-bold text-2xl mb-4 text-cyan-300" data-testid="wrapper-title">
              WavesWrapper
            </h3>
            <p className="text-gray-400 mb-6" data-testid="wrapper-description">
              Installation wrapper with automated setup scripts and configuration tools
            </p>
            <div className="text-sm text-gray-500 mb-6">
              <div>Size: ~150 MB</div>
              <div>Format: ZIP Archive</div>
              <div>Version: 2024.1</div>
            </div>
            <Button 
              onClick={() => handleDownload('wrapper')}
              disabled={isDownloading === 'wrapper'}
              className="w-full bg-cyan-600 hover:bg-cyan-500 border border-cyan-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
              data-testid="button-download-wrapper"
            >
              {isDownloading === 'wrapper' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 w-4 h-4" />
                  Download ZIP
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Need help choosing? Check our installation guide below</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-gray-800 px-4 py-2 rounded-full text-sm flex items-center">
              <Check className="text-green-400 mr-2 w-4 h-4" />
              SHA256 Checksums Available
            </span>
            <span className="bg-gray-800 px-4 py-2 rounded-full text-sm flex items-center">
              <Check className="text-green-400 mr-2 w-4 h-4" />
              GPG Signatures Included
            </span>
            <span className="bg-gray-800 px-4 py-2 rounded-full text-sm flex items-center">
              <Check className="text-green-400 mr-2 w-4 h-4" />
              Torrent Downloads
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { storage } from "./storage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function registerRoutes(app: Express): Promise<Server> {
  // Download WavesOS ISO endpoint
  app.get("/api/download/iso", async (req, res) => {
    try {
      const filename = "wavesinstaller_ultra.iso";
      const downloadsDir = process.env.NODE_ENV === "production" 
        ? path.join(__dirname, "downloads")  // In production, downloads are copied to dist/downloads
        : path.join(__dirname, "downloads"); // In development, use server/downloads
      const filePath = path.join(downloadsDir, filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "ISO file not found. Please place the ISO file in server/downloads/ folder." });
      }

      // Track download statistics
      await storage.incrementDownload(filename, "iso");

      // Set headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/octet-stream');

      // Stream the actual file
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error("ISO download error:", err);
          if (!res.headersSent) {
            res.status(500).json({ message: "Download failed" });
          }
        }
      });
    } catch (error) {
      console.error("ISO download error:", error);
      res.status(500).json({ message: "Download failed" });
    }
  });

  // Download WavesWrapper endpoint
  app.get("/api/download/wrapper", async (req, res) => {
    try {
      const filename = "waves_wrapper.zip";
      const downloadsDir = process.env.NODE_ENV === "production" 
        ? path.join(__dirname, "downloads")  // In production, downloads are copied to dist/downloads
        : path.join(__dirname, "downloads"); // In development, use server/downloads
      const filePath = path.join(downloadsDir, filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "ZIP file not found. Please place the ZIP file in server/downloads/ folder." });
      }

      // Track download statistics
      await storage.incrementDownload(filename, "wrapper");

      // Set headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/zip');

      // Stream the actual file
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error("Wrapper download error:", err);
          if (!res.headersSent) {
            res.status(500).json({ message: "Download failed" });
          }
        }
      });
    } catch (error) {
      console.error("Wrapper download error:", error);
      res.status(500).json({ message: "Download failed" });
    }
  });

  // Get download statistics
  app.get("/api/download/stats", async (req, res) => {
    try {
      const stats = await storage.getDownloadStats();
      res.json(stats);
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "Failed to fetch download statistics" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || !email.includes('@')) {
        return res.status(400).json({ message: "Valid email address required" });
      }

      // In a real implementation, you would save to database and send confirmation email
      console.log(`Newsletter subscription: ${email}`);

      res.json({ 
        message: "Successfully subscribed to newsletter",
        email 
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ message: "Subscription failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
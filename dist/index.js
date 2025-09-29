// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import path from "path";
import fs from "fs";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  downloads;
  constructor() {
    this.downloads = /* @__PURE__ */ new Map();
    const isoDownload = {
      id: randomUUID(),
      filename: "wavesinstaller_ultra.iso",
      downloadCount: 0,
      fileType: "iso"
    };
    const wrapperDownload = {
      id: randomUUID(),
      filename: "waves_wrapper.zip",
      downloadCount: 0,
      fileType: "wrapper"
    };
    this.downloads.set(isoDownload.filename, isoDownload);
    this.downloads.set(wrapperDownload.filename, wrapperDownload);
  }
  async getDownload(filename) {
    return this.downloads.get(filename);
  }
  async createDownload(insertDownload) {
    const id = randomUUID();
    const download = {
      ...insertDownload,
      id,
      downloadCount: 0
    };
    this.downloads.set(download.filename, download);
    return download;
  }
  async incrementDownload(filename, fileType) {
    let download = this.downloads.get(filename);
    if (!download) {
      download = await this.createDownload({ filename, fileType });
    }
    download.downloadCount += 1;
    this.downloads.set(filename, download);
    return download;
  }
  async getDownloadStats() {
    let isoCount = 0;
    let wrapperCount = 0;
    for (const download of Array.from(this.downloads.values())) {
      if (download.fileType === "iso") {
        isoCount += download.downloadCount;
      } else if (download.fileType === "wrapper") {
        wrapperCount += download.downloadCount;
      }
    }
    return {
      iso: isoCount,
      wrapper: wrapperCount,
      total: isoCount + wrapperCount
    };
  }
};
var storage = new MemStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/download/iso", async (req, res) => {
    try {
      const filename = "wavesinstaller_ultra.iso";
      const filePath = path.join(import.meta.dirname, "downloads", filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "ISO file not found. Please place the ISO file in server/downloads/ folder." });
      }
      await storage.incrementDownload(filename, "iso");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", "application/octet-stream");
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
  app2.get("/api/download/wrapper", async (req, res) => {
    try {
      const filename = "waves_wrapper.zip";
      const filePath = path.join(import.meta.dirname, "downloads", filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "ZIP file not found. Please place the ZIP file in server/downloads/ folder." });
      }
      await storage.incrementDownload(filename, "wrapper");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", "application/zip");
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
  app2.get("/api/download/stats", async (req, res) => {
    try {
      const stats = await storage.getDownloadStats();
      res.json(stats);
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "Failed to fetch download statistics" });
    }
  });
  app2.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email address required" });
      }
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    minify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-accordion", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"]
        }
      }
    },
    target: "es2020",
    chunkSizeWarningLimit: 1e3
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    },
    host: "0.0.0.0",
    port: 5e3
  },
  preview: {
    host: "0.0.0.0",
    port: 5e3
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (process.env.NODE_ENV === "development") {
      console.error("Server Error:", err);
    }
    res.status(status).json({
      message: process.env.NODE_ENV === "production" ? "Internal Server Error" : message
    });
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

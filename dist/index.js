var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

// server/routes.ts
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  downloads: () => downloads,
  insertDownloadSchema: () => insertDownloadSchema
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var downloads = pgTable("downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  downloadCount: integer("download_count").notNull().default(0),
  fileType: text("file_type").notNull()
  // 'iso' or 'wrapper'
});
var insertDownloadSchema = createInsertSchema(downloads).pick({
  filename: true,
  fileType: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : { rejectUnauthorized: false }
};
var pool = new Pool(poolConfig);
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  async getDownload(filename) {
    const [download] = await db.select().from(downloads).where(eq(downloads.filename, filename));
    return download || void 0;
  }
  async createDownload(insertDownload) {
    const [download] = await db.insert(downloads).values(insertDownload).returning();
    return download;
  }
  async incrementDownload(filename, fileType) {
    let download = await this.getDownload(filename);
    if (!download) {
      download = await this.createDownload({ filename, fileType });
    }
    const [updatedDownload] = await db.update(downloads).set({ downloadCount: sql2`${downloads.downloadCount} + 1` }).where(eq(downloads.filename, filename)).returning();
    return updatedDownload;
  }
  async getDownloadStats() {
    const allDownloads = await db.select().from(downloads);
    let isoCount = 0;
    let wrapperCount = 0;
    for (const download of allDownloads) {
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
var storage = new DatabaseStorage();

// server/routes.ts
var __dirname = path.dirname(fileURLToPath(import.meta.url));
async function registerRoutes(app2) {
  app2.get("/api/download/iso", async (req, res) => {
    try {
      const filename = "wavesinstaller_ultra.iso";
      const downloadsDir = process.env.NODE_ENV === "production" ? path.join(__dirname, "downloads") : path.join(__dirname, "downloads");
      const filePath = path.join(downloadsDir, filename);
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
      const downloadsDir = process.env.NODE_ENV === "production" ? path.join(__dirname, "downloads") : path.join(__dirname, "downloads");
      const filePath = path.join(downloadsDir, filename);
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
import { fileURLToPath as fileURLToPath3 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var __dirname2 = path2.dirname(fileURLToPath2(import.meta.url));
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
      "@": path2.resolve(__dirname2, "client", "src"),
      "@shared": path2.resolve(__dirname2, "shared"),
      "@assets": path2.resolve(__dirname2, "attached_assets")
    }
  },
  root: path2.resolve(__dirname2, "client"),
  build: {
    outDir: path2.resolve(__dirname2, "dist/public"),
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
var __dirname3 = path3.dirname(fileURLToPath3(import.meta.url));
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
        __dirname3,
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
  const distPath = path3.resolve(__dirname3, "public");
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
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
var app = express2();
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === "production" ? void 0 : false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
var corsOptions = {
  origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL || false : true,
  credentials: false,
  // Disable credentials since no auth is used
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
};
app.use(cors(corsOptions));
app.use(express2.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: false, limit: "10mb" }));
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

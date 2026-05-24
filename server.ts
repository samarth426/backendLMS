/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import apiRouter from "./backend/routes.js";

// Load Environment Configuration
dotenv.config();

const app = express();
const PORT = 3000;

// =========================================================
// 1. Stripe Raw Body Parser Middleware
// =========================================================
// Stripe signature validation demands the exact unparsed raw buffer of the request body.
// We intercept /api/payments/webhook before standard body parsers read it.
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  (req: any, res: Response, next: NextFunction) => {
    req.rawBody = req.body;
    next();
  }
);

// Standard JSON and URL-encoded parsers for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================
// 2. Custom Secure CORS Middleware Setup
// =========================================================
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  const appUrl = process.env.APP_URL;

  // Let development/preview origins pass through, or lock down to App URL
  if (appUrl) {
    res.setHeader("Access-Control-Allow-Origin", appUrl);
  } else if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, stripe-signature"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// =========================================================
// 3. Register Modular Backend REST API Router
// =========================================================
app.use("/api", apiRouter);

// Database Health Status
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// =========================================================
// 4. Vite Dynamic Hot Dev/Static Production Serving Client
// =========================================================
async function startApplicationServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Spinning up Vite asset middleware compiler (Development mode)...");
    const viteInstance = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(viteInstance.middlewares);
  } else {
    console.log("Serving static production assets from dist/ folder...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`===================================================`);
    console.log(` SixSigma AI Platform online at http://0.0.0.0:${PORT}`);
    console.log(` Integrated Back End - API Root: http://0.0.0.0:${PORT}/api`);
    console.log(`===================================================`);
  });
}

startApplicationServer().catch((err) => {
  console.error("Vite/Express bootstrap engine crashed:", err);
});

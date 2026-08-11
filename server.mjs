/**
 * Production server for Vigyanics.
 *
 * Responsibilities:
 *  1. Starts the built Express API server (artifacts/api-server/dist/index.mjs)
 *     as a child process on an internal port.
 *  2. Serves the built store frontend (artifacts/vigyanics/dist/public) at "/".
 *  3. Serves the built admin panel (artifacts/admin/dist/public) at "/admin/".
 *  4. Reverse-proxies every "/api/*" request to the internal API server.
 *
 * This lets a single Railway service host both the store + admin + API on one
 * domain without CORS issues (everything is same-origin).
 */

import express from "express";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------
const PORT = Number(process.env.PORT);
if (!PORT || PORT <= 0) {
  throw new Error(
    "PORT environment variable is required and must be a positive number.",
  );
}

// Internal port the API server runs on. The public server proxies /api to it.
const API_INTERNAL_PORT = Number(process.env.API_INTERNAL_PORT || 4000);
const API_BASE = `http://127.0.0.1:${API_INTERNAL_PORT}`;

const ADMIN_PATH = process.env.ADMIN_PATH || "/admin/";

// ---------------------------------------------------------------------------
// Start the API server as a child process
// ---------------------------------------------------------------------------
const apiServerEntry = path.join(
  __dirname,
  "artifacts",
  "api-server",
  "dist",
  "index.mjs",
);

const apiChild = spawn(
  process.execPath,
  ["--enable-source-maps", apiServerEntry],
  {
    env: {
      ...process.env,
      PORT: String(API_INTERNAL_PORT),
    },
    stdio: "inherit",
  },
);

apiChild.on("error", (err) => {
  console.error("[server] Failed to start API server:", err);
});

apiChild.on("exit", (code, signal) => {
  console.error(
    `[server] API server exited (code=${code}, signal=${signal}).`,
  );
});

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------
const app = express();
app.disable("x-powered-by");

const webDist = path.join(__dirname, "artifacts", "vigyanics", "dist", "public");
const adminDist = path.join(__dirname, "artifacts", "admin", "dist", "public");

// --- Reverse proxy: /api -> internal API server -----------------------------
app.use("/api", (req, res) => {
  const forward = http.request(
    {
      host: "127.0.0.1",
      port: API_INTERNAL_PORT,
      path: "/api" + req.url,
      method: req.method,
      headers: { ...req.headers, host: `127.0.0.1:${API_INTERNAL_PORT}` },
    },
    (upstream) => {
      res.writeHead(upstream.statusCode || 502, upstream.headers);
      upstream.pipe(res);
    },
  );

  forward.on("error", (err) => {
    console.error("[server] API proxy error:", err.message);
    if (!res.headersSent) {
      res.status(502).json({ error: "API temporarily unavailable." });
    } else {
      res.end();
    }
  });

  req.pipe(forward);
});

// --- Admin panel static files + SPA fallback --------------------------------
app.use(ADMIN_PATH, express.static(adminDist));
app.get(`${ADMIN_PATH}*`, (req, res, next) => {
  if (req.path.startsWith(ADMIN_PATH)) {
    return res.sendFile(path.join(adminDist, "index.html"));
  }
  next();
});

// --- Store frontend static files + SPA fallback -----------------------------
app.use(express.static(webDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  return res.sendFile(path.join(webDist, "index.html"));
});

// ---------------------------------------------------------------------------
// Start the public server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`[server] Vigyanics production server listening on ${PORT}`);
  console.log(`[server] Store:    http://localhost:${PORT}/`);
  console.log(`[server] Admin:    http://localhost:${PORT}${ADMIN_PATH}`);
  console.log(`[server] API:      http://localhost:${PORT}/api (proxied)`);
});

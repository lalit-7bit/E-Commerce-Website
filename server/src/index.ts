import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import authRoutes from "./routes/auth";
import cartRoutes from "./routes/cart";
import addressRoutes from "./routes/addresses";
import wishlistRoutes from "./routes/wishlist";
import orderRoutes from "./routes/orders";
import adminRoutes from "./routes/admin";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const configuredOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const clientDistPath = path.resolve(import.meta.dirname, "..", "..", "client", "dist");

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...configuredOrigins,
]);

function isAllowedOrigin(origin?: string) {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use(express.static(clientDistPath));
app.get("/{*path}", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    next();
    return;
  }

  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  void next;
  console.error("Unhandled server error:", error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Express API running on http://localhost:${port}`);
});

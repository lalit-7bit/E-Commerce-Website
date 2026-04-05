import cors from "cors";
import dotenv from "dotenv";
import express from "express";
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

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...configuredOrigins,
]);

function isAllowedOrigin(origin?: string) {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;

  // Allow Vercel production/preview deployments for this frontend.
  if (/^https:\/\/e-commerce-website-[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
    return true;
  }

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

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled server error:", error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Express API running on http://localhost:${port}`);
});

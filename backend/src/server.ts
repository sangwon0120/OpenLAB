import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";
import { prisma } from "./db.js";
import { registerAuthRoutes } from "./routes/auth.js";

const app = Fastify({ logger: true });

const port = Number(process.env.PORT || 4000);

await app.register(cors, {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
});

app.get("/health", async () => ({ status: "ok" }));

await registerAuthRoutes(app);

app.addHook("onClose", async () => {
  await prisma.$disconnect();
});

app.listen({ port, host: "0.0.0.0" });

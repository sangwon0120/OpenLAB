import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "../db.js";

type SignupBody = {
  email?: string;
  password?: string;
  name?: string;
  role?: "student" | "lab" | "master";
  labName?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post<{ Body: SignupBody }>("/auth/signup", async (req, reply) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const name = String(req.body?.name || "").trim();
    const role = (req.body?.role || "student") as SignupBody["role"];
    const labName = String(req.body?.labName || "").trim();

    if (!email || !password) {
      return reply.code(400).send({ success: false, error: "email/password required" });
    }

    if (role === "lab" && !labName) {
      return reply.code(400).send({ success: false, error: "labName required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.code(409).send({ success: false, error: "email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
        role: role || "student",
        labName: labName || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        labName: true,
        createdAt: true,
      },
    });

    return reply.send({ success: true, user });
  });

  app.post<{ Body: LoginBody }>("/auth/login", async (req, reply) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return reply.code(400).send({ success: false, error: "email/password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.code(401).send({ success: false, error: "invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return reply.code(401).send({ success: false, error: "invalid credentials" });
    }

    return reply.send({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        labName: user.labName,
        createdAt: user.createdAt,
      },
    });
  });
}

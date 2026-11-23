import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL?.trim();
  const useNeonAdapter =
    Boolean(connectionString) &&
    (connectionString!.includes("neon.tech") ||
      process.env.PRISMA_USE_NEON_ADAPTER === "true");

  if (useNeonAdapter && connectionString) {
    // Vercel/serverless: Neon WebSocket driver wakes idle computes more reliably than TCP.
    neonConfig.webSocketConstructor = ws;
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

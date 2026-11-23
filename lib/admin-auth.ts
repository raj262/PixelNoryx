import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { Role, User } from "@prisma/client";
import { prisma } from "@/lib/db";

const COOKIE = "pn_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type AdminSessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

function secretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(user: Pick<User, "id" | "name" | "email" | "role">) {
  const token = await new SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());

  const jar = await cookies();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const secure =
    process.env.ADMIN_COOKIE_SECURE === "true" ||
    (process.env.ADMIN_COOKIE_SECURE !== "false" && siteUrl.startsWith("https://"));

  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroyAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getAdminSession(): Promise<AdminSessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    const id = String(payload.sub ?? "");
    const role = payload.role as Role | undefined;
    const email = String(payload.email ?? "");
    const name = String(payload.name ?? "");
    if (!id || !role || !email) return null;
    return { id, name, email, role };
  } catch {
    return null;
  }
}

export async function requireAdminSession(
  allowed: Role[] = ["ADMIN", "EDITOR"]
): Promise<AdminSessionUser> {
  const session = await getAdminSession();
  if (!session || !allowed.includes(session.role)) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireAdminApi(allowed: Role[] = ["ADMIN", "EDITOR"]) {
  const session = await getAdminSession();
  if (!session || !allowed.includes(session.role)) {
    return { session: null as AdminSessionUser | null, error: Response.json({ message: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null as Response | null };
}

export function canManageUsers(role: Role) {
  return role === "ADMIN";
}

export function canManageSeo(role: Role) {
  return role === "ADMIN" || role === "EDITOR";
}

export function canManagePosts(role: Role) {
  return role === "ADMIN" || role === "EDITOR";
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
}

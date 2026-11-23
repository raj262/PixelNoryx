import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { canManageUsers, hashPassword, requireAdminApi } from "@/lib/admin-auth";

export async function GET() {
  const { session, error } = await requireAdminApi(["ADMIN"]);
  if (error || !session) return error!;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ data: users });
}

export async function POST(req: Request) {
  const { session, error } = await requireAdminApi(["ADMIN"]);
  if (error || !session) return error!;
  if (!canManageUsers(session.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as {
    name?: string;
    email?: string;
    password?: string;
    role?: Role;
  };

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");
  const role = (body.role ?? "EDITOR") as Role;

  if (!name || !email || password.length < 6) {
    return NextResponse.json(
      { message: "Name, email, and password (min 6) are required." },
      { status: 400 }
    );
  }

  if (!["ADMIN", "EDITOR", "USER"].includes(role)) {
    return NextResponse.json({ message: "Invalid role." }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ message: "Email already registered." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      role,
      passwordHash: await hashPassword(password),
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ data: user }, { status: 201 });
}

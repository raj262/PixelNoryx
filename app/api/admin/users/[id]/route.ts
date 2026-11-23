import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { canManageUsers, hashPassword, requireAdminApi } from "@/lib/admin-auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const { session, error } = await requireAdminApi(["ADMIN"]);
  if (error || !session) return error!;
  if (!canManageUsers(session.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = (await req.json()) as {
    name?: string;
    role?: Role;
    password?: string;
  };

  const data: { name?: string; role?: Role; passwordHash?: string } = {};
  if (body.name?.trim()) data.name = body.name.trim();
  if (body.role && ["ADMIN", "EDITOR", "USER"].includes(body.role)) {
    data.role = body.role;
  }
  if (body.password && body.password.length >= 6) {
    data.passwordHash = await hashPassword(body.password);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ data: user });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { session, error } = await requireAdminApi(["ADMIN"]);
  if (error || !session) return error!;

  const { id } = await ctx.params;
  if (id === session.id) {
    return NextResponse.json({ message: "You cannot delete your own account." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

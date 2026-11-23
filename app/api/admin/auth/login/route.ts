import { NextResponse } from "next/server";
import {
  createAdminSession,
  findUserByEmail,
  verifyPassword,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required." }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ message: "No admin access for this account." }, { status: 403 });
    }

    await createAdminSession(user);

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("[admin login]", error);
    const raw = error instanceof Error ? error.message : String(error);
    const dbUnreachable =
      raw.includes("Can't reach database server") ||
      raw.includes("P1001") ||
      raw.includes("Timed out fetching") ||
      raw.includes("Connection terminated");

    if (dbUnreachable) {
      return NextResponse.json(
        {
          message:
            "Database unreachable (Neon cold start / wrong DATABASE_URL). Use the pooled Neon URL with &connect_timeout=15&pool_timeout=15, then Redeploy.",
        },
        { status: 503 }
      );
    }

    if (raw.includes("ADMIN_SESSION_SECRET")) {
      return NextResponse.json(
        { message: "ADMIN_SESSION_SECRET is missing on Vercel." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Login failed." }, { status: 500 });
  }
}

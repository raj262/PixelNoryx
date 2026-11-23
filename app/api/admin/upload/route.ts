import { NextResponse } from "next/server";
import { canManagePosts, requireAdminApi } from "@/lib/admin-auth";
import { isStorageConfigured, uploadObject, type StorageBucket } from "@/lib/storage";

export async function POST(req: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error!;
  if (!canManagePosts(session.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      {
        message:
          "Object Storage is not configured. Run neon login then neon deploy to pull AWS_* env vars.",
      },
      { status: 503 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    const bucketField = String(form.get("bucket") ?? "media");
    const bucket = (bucketField === "assets" ? "assets" : "media") as StorageBucket;

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "file is required" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `uploads/${session.id}/${Date.now()}-${safeName}`;
    const result = await uploadObject({
      bucket,
      key,
      body: bytes,
      contentType: file.type || "application/octet-stream",
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}

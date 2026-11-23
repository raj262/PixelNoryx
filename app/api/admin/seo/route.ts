import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canManageSeo, requireAdminApi } from "@/lib/admin-auth";

async function getOrCreateSeo() {
  const existing = await prisma.seoSetting.findUnique({ where: { id: 1 } });
  if (existing) return existing;
  return prisma.seoSetting.create({ data: { id: 1 } });
}

export async function GET() {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error!;

  const seo = await getOrCreateSeo();
  return NextResponse.json({ data: seo });
}

export async function PUT(req: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error!;
  if (!canManageSeo(session.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as Record<string, string>;
  const seo = await prisma.seoSetting.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      siteUrl: body.siteUrl ?? "https://www.pixelnoryx.com",
      defaultTitle: body.defaultTitle ?? "",
      defaultDescription: body.defaultDescription ?? "",
      defaultKeywords: body.defaultKeywords ?? "",
      titleTemplate: body.titleTemplate ?? "%s | PixelNoryx",
      homeTitle: body.homeTitle ?? "",
      homeDescription: body.homeDescription ?? "",
      homeKeywords: body.homeKeywords ?? "",
      ogImage: body.ogImage ?? "",
      twitterHandle: body.twitterHandle ?? "",
      robots: body.robots ?? "index, follow",
      googleSiteVerification: body.googleSiteVerification ?? "",
      bingSiteVerification: body.bingSiteVerification ?? "",
    },
    update: {
      siteUrl: body.siteUrl,
      defaultTitle: body.defaultTitle,
      defaultDescription: body.defaultDescription,
      defaultKeywords: body.defaultKeywords,
      titleTemplate: body.titleTemplate,
      homeTitle: body.homeTitle,
      homeDescription: body.homeDescription,
      homeKeywords: body.homeKeywords,
      ogImage: body.ogImage,
      twitterHandle: body.twitterHandle,
      robots: body.robots,
      googleSiteVerification: body.googleSiteVerification,
      bingSiteVerification: body.bingSiteVerification,
    },
  });

  return NextResponse.json({ data: seo });
}

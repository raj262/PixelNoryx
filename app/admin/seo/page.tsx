import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import SeoForm from "@/components/admin/SeoForm";

export default async function AdminSeoPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const seo =
    (await prisma.seoSetting.findUnique({ where: { id: 1 } })) ??
    (await prisma.seoSetting.create({ data: { id: 1 } }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Site SEO</h1>
        <p className="mt-1 text-muted">
          Global defaults for titles, descriptions, robots, and verification tags.
        </p>
      </div>
      <SeoForm
        initial={{
          siteUrl: seo.siteUrl,
          defaultTitle: seo.defaultTitle,
          defaultDescription: seo.defaultDescription,
          defaultKeywords: seo.defaultKeywords,
          titleTemplate: seo.titleTemplate,
          homeTitle: seo.homeTitle,
          homeDescription: seo.homeDescription,
          homeKeywords: seo.homeKeywords,
          ogImage: seo.ogImage,
          twitterHandle: seo.twitterHandle,
          robots: seo.robots,
          googleSiteVerification: seo.googleSiteVerification,
          bingSiteVerification: seo.bingSiteVerification,
        }}
      />
    </div>
  );
}

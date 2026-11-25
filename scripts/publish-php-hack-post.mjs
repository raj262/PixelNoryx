import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvFile(name) {
  try {
    const text = readFileSync(resolve(process.cwd(), name), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (!m) continue;
      const key = m[1].trim();
      let val = m[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* missing file ok */
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const content = `
<h2>What happened</h2>
<p>On <strong>19 November 2026</strong>, the PHP project shipped emergency security releases: <code>8.5.13</code>, <code>8.4.28</code>, <code>8.3.37</code>, and <code>8.2.36</code>. The batch fixes <strong>seven critical</strong> issues (several rated <strong>CVSS 9.2</strong>) plus multiple high-severity bugs. Several paths can end in <strong>remote code execution</strong>.</p>
<p>Public write-ups and PoCs followed quickly. NHS Digital and hosting providers treated this as an active patching event — not a quiet changelog entry.</p>

<h2>The scary one: PHP-FPM request smuggling (CVE-2026-129289)</h2>
<p>This is the headline for most Laravel / Nginx / Apache stacks.</p>
<p><strong>CVE-2026-129289</strong> — if PHP opens <code>php://input</code> but does not read the body to the end, leftover bytes can stay on a reused FastCGI connection. When the front end keeps the backend connection open (for example Nginx <code>fastcgi_keep_conn on</code>, or Apache <code>mod_proxy_fcgi</code> with reuse enabled), PHP-FPM may parse those leftover bytes as a <em>new</em> FastCGI request.</p>
<p>An unauthenticated attacker can craft a multipart request that smuggles backend parameters such as <code>SCRIPT_FILENAME</code>, <code>REMOTE_ADDR</code>, or even <code>PHP_ADMIN_VALUE</code> — which can mean running attacker-controlled PHP.</p>
<p><strong>Default Nginx/Apache often leave connection reuse off</strong>, which lowers exposure. Custom performance tweaks that enable keep-alive to PHP-FPM raise it sharply. Audit anyway.</p>
<pre><code># Look for FastCGI keep-alive (bad for this CVE)
sudo grep -rn "fastcgi_keep_conn" /etc/nginx/
</code></pre>

<h2>Other critical RCEs in the same drop</h2>
<ul>
<li><strong>CVE-2026-129496</strong> — timezone cache use-after-free.</li>
<li><strong>CVE-2026-126714</strong> — partially overwritten session files.</li>
<li><strong>CVE-2026-115560</strong> — session serializer mismatch with upload_progress.</li>
<li><strong>CVE-2026-129481</strong> — UAF after interrupted session shutdown.</li>
<li><strong>CVE-2026-129474</strong> — UAF in magic-method backtraces (PHP 8.5).</li>
<li><strong>CVE-2026-129182</strong> — fatal-error backtrace UAF on 8.5.</li>
</ul>

<h2>Fixed versions</h2>
<ul>
<li>PHP <strong>8.5.13</strong></li>
<li>PHP <strong>8.4.28</strong></li>
<li>PHP <strong>8.3.37</strong></li>
<li>PHP <strong>8.2.36</strong></li>
</ul>

<h2>Practical checklist</h2>
<ol>
<li>Inventory every PHP version (CLI + FPM).</li>
<li>Upgrade packages to the fixed versions.</li>
<li>Restart FPM and verify versions.</li>
<li>Restart queues, Horizon, Octane, and other long-lived workers.</li>
<li>Remove <code>fastcgi_keep_conn on</code> if present; reload Nginx.</li>
</ol>
<pre><code>php artisan queue:restart
php artisan horizon:terminate
</code></pre>

<p><strong>Bottom line:</strong> upgrade PHP now, restart workers, kill FastCGI keep-alive if you enabled it, verify versions.</p>
`.trim();

const prisma = new PrismaClient();

const slug = "php-november-2026-security-hack";

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
  });

  await prisma.post.updateMany({
    where: { featured: true, slug: { not: slug } },
    data: { featured: false },
  });

  const post = await prisma.post.upsert({
    where: { slug },
    update: {
      issueNumber: 45,
      title:
        "PHP Just Got Hit Hard: November 2026 RCE Flaws You Must Patch Now",
      excerpt:
        "Seven critical CVEs landed on 19 Nov 2026 — including PHP-FPM request smuggling that can mean unauthenticated remote code execution. Here is what broke, who is exposed, and how to patch.",
      preview:
        "If your servers still run unpatched PHP 8.2–8.5, treat this week like an incident — not a nice-to-have upgrade.",
      content,
      image:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
      topic: "Laravel",
      tags: JSON.stringify(["PHP", "Security", "CVE", "Laravel", "DevOps"]),
      readTime: "10 min read",
      status: "PUBLISHED",
      featured: true,
      free: true,
      publishedAt: new Date("2026-11-25T10:00:00.000Z"),
      metaTitle:
        "PHP November 2026 Security Hack: Patch CVE-2026-129289 RCE Now",
      metaDescription:
        "November 2026 PHP advisory explained: PHP-FPM request smuggling RCE, critical CVEs, fixed versions (8.5.13 / 8.4.28 / 8.3.37 / 8.2.36), and a patch checklist for production servers.",
      metaKeywords:
        "PHP security November 2026, CVE-2026-129289, PHP-FPM request smuggling, PHP RCE patch, Laravel PHP update",
      authorId: admin?.id ?? null,
    },
    create: {
      issueNumber: 45,
      slug,
      title:
        "PHP Just Got Hit Hard: November 2026 RCE Flaws You Must Patch Now",
      excerpt:
        "Seven critical CVEs landed on 19 Nov 2026 — including PHP-FPM request smuggling that can mean unauthenticated remote code execution. Here is what broke, who is exposed, and how to patch.",
      preview:
        "If your servers still run unpatched PHP 8.2–8.5, treat this week like an incident — not a nice-to-have upgrade.",
      content,
      image:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
      topic: "Laravel",
      tags: JSON.stringify(["PHP", "Security", "CVE", "Laravel", "DevOps"]),
      readTime: "10 min read",
      status: "PUBLISHED",
      featured: true,
      free: true,
      publishedAt: new Date("2026-11-25T10:00:00.000Z"),
      metaTitle:
        "PHP November 2026 Security Hack: Patch CVE-2026-129289 RCE Now",
      metaDescription:
        "November 2026 PHP advisory explained: PHP-FPM request smuggling RCE, critical CVEs, fixed versions (8.5.13 / 8.4.28 / 8.3.37 / 8.2.36), and a patch checklist for production servers.",
      metaKeywords:
        "PHP security November 2026, CVE-2026-129289, PHP-FPM request smuggling, PHP RCE patch, Laravel PHP update",
      authorId: admin?.id ?? null,
    },
  });

  console.log("Published:", post.slug, post.status, post.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

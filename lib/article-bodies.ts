/**
 * Full article HTML used when CMS/API content is thin.
 * Keeps public pages AdSense-ready even if admin content is short.
 */
export const articleBodies: Record<string, string> = {
  "php-november-2026-security-hack": `
<h2>What happened</h2>
<p>On <strong>19 November 2026</strong>, the PHP project shipped emergency security releases: <code>8.5.13</code>, <code>8.4.28</code>, <code>8.3.37</code>, and <code>8.2.36</code>. The batch fixes <strong>seven critical</strong> issues (several rated <strong>CVSS 9.2</strong>) plus multiple high-severity bugs. Several paths can end in <strong>remote code execution</strong>.</p>
<p>Public write-ups and PoCs followed quickly. NHS Digital and hosting providers treated this as an active patching event — not a quiet changelog entry.</p>

<h2>The scary one: PHP-FPM request smuggling (CVE-2026-129289)</h2>
<p>This is the headline for most Laravel / Nginx / Apache stacks.</p>
<p><strong>CVE-2026-129289</strong> — if PHP opens <code>php://input</code> but does not read the body to the end, leftover bytes can stay on a reused FastCGI connection. When the front end keeps the backend connection open (for example Nginx <code>fastcgi_keep_conn on</code>, or Apache <code>mod_proxy_fcgi</code> with reuse enabled), PHP-FPM may parse those leftover bytes as a <em>new</em> FastCGI request.</p>
<p>An unauthenticated attacker can craft a multipart request that smuggles backend parameters such as <code>SCRIPT_FILENAME</code>, <code>REMOTE_ADDR</code>, or even <code>PHP_ADMIN_VALUE</code> — which can mean running attacker-controlled PHP.</p>
<p><strong>Default Nginx/Apache often leave connection reuse off</strong>, which lowers exposure. Custom performance tweaks that enable keep-alive to PHP-FPM raise it sharply. Audit anyway — “we use Laravel Forge / default Nginx” is not a substitute for checking the config.</p>

<pre><code># Look for FastCGI keep-alive (bad for this CVE)
sudo grep -rn "fastcgi_keep_conn" /etc/nginx/
</code></pre>

<h2>Other critical RCEs in the same drop</h2>
<ul>
<li><strong>CVE-2026-129496</strong> — timezone cache use-after-free (file-based error_log + early warnings).</li>
<li><strong>CVE-2026-126714</strong> — partially overwritten session files (default file sessions + interrupted write).</li>
<li><strong>CVE-2026-115560</strong> — session serializer mismatch when <code>session.upload_progress</code> is on with a non-default serializer.</li>
<li><strong>CVE-2026-129481</strong> — UAF after interrupted session shutdown (8.3–8.5).</li>
<li><strong>CVE-2026-129474</strong> — UAF in magic-method backtraces on PHP 8.5 when <code>zend.exception_ignore_args=Off</code>.</li>
<li><strong>CVE-2026-129182</strong> — related fatal-error backtrace UAF on 8.5.</li>
</ul>
<p>High-severity items also include FPM privilege escalation, PHAR signature bypass, mixed-case URL schemes leaking plaintext, and header folding DoS.</p>

<h2>Fixed versions (patch targets)</h2>
<ul>
<li>PHP <strong>8.5.13</strong></li>
<li>PHP <strong>8.4.28</strong></li>
<li>PHP <strong>8.3.37</strong></li>
<li>PHP <strong>8.2.36</strong></li>
</ul>
<p>EOL lines (8.1 and older) did not get new upstream minors in the same way — some distro packages backported fixes as package revisions. If you are still on 8.1 or below, patch packages <em>and</em> plan a move to a supported major.</p>

<h2>Practical checklist for Laravel / PHP-FPM servers</h2>
<ol>
<li><strong>Inventory PHP</strong> — every version on the box (CLI + FPM), not only the one your main site uses.</li>
<li><strong>Upgrade packages</strong> to the fixed versions above (apt / remi / sury / Forge “Update PHP”).</li>
<li><strong>Restart FPM</strong> — package scripts usually do; verify with <code>php-fpmX.Y -v</code>.</li>
<li><strong>Restart long-lived workers</strong> — queues, Horizon, Octane, Reverb, RoadRunner, custom daemons still hold the old binary until restart.</li>
<li><strong>Remove <code>fastcgi_keep_conn on</code></strong> if present, then reload Nginx.</li>
<li><strong>Confirm</strong> <code>php -v</code> / FPM version matches the advisory table.</li>
</ol>

<pre><code>php artisan queue:restart
php artisan horizon:terminate
# Octane / other supervisors: reload or restart per your process manager
</code></pre>

<h2>What this means for PixelNoryx readers</h2>
<p>Most of us ship Laravel APIs behind Nginx + PHP-FPM. This advisory is not “only obscure shared hosts.” It is core runtime. Patching PHP is as important as patching Composer dependencies after a critical Laravel CVE.</p>
<p>If you manage client servers: treat unpatched 8.2–8.5 as <strong>priority one</strong> until versions match the fixed list. If you cannot patch today, at least disable FastCGI connection reuse and reduce session/upload-progress attack surface — then patch within hours, not weeks.</p>

<h2>Sources to follow</h2>
<ul>
<li>PHP project archive / changelogs for 19 Nov 2026</li>
<li>Hosting provider advisories (e.g. Laravel Forge PHP security advisory)</li>
<li>National CERT / CSOC alerts summarizing the same CVE set</li>
</ul>
<p><strong>Bottom line:</strong> upgrade PHP now, restart workers, kill FastCGI keep-alive if you enabled it, verify versions. Yesterday’s “stable” box is today’s exploit target.</p>
`,

  "laravel-queues-production-guide": `
<h2>Why localhost lies about queues</h2>
<p>On a laptop, <code>php artisan queue:work</code> feels fine. In production, workers crash, jobs pile up, emails send twice, and timeouts kill half-finished imports. Reliability comes from explicit policies — not hoping Redis stays happy.</p>
<p>This guide covers retry budgets, timeouts, failed-job handling, and a shipping checklist for Laravel apps that depend on background work.</p>

<h2>Pick a driver with eyes open</h2>
<ul>
<li><strong>Database</strong> — fine for low volume; easy to inspect; can contend with app traffic.</li>
<li><strong>Redis</strong> — default for most production apps; fast and battle-tested.</li>
<li><strong>SQS / cloud queues</strong> — great when you want managed scaling and multi-server delivery.</li>
</ul>
<p>Whatever you choose, treat the queue as part of your disaster recovery story. Backups that ignore job payloads leave you half-restored.</p>

<h2>Retries need a budget</h2>
<p>Unlimited retries turn a poison message into an infinite CPU bill. Prefer a small, intentional budget:</p>
<pre><code>public $tries = 5;
public $backoff = [10, 30, 60, 120];
</code></pre>
<p>Use exponential backoff for third-party APIs. For user-facing mail, fail faster and surface the error in an admin UI rather than retrying overnight.</p>
<p>Distinguish <em>transient</em> failures (rate limits, blips) from <em>permanent</em> ones (invalid payload). Permanent failures should fail the job immediately without burning retries.</p>

<h2>Timeouts: match the work</h2>
<p>A 60-second worker timeout on a 3-minute PDF export guarantees zombies. Set job-level timeouts consciously:</p>
<ul>
<li>Short API fan-out jobs: 30–60s</li>
<li>Report generation: minutes, on a dedicated queue</li>
<li>Never share one worker pool for “instant mail” and “heavy ETL”</li>
</ul>
<p>If you use Horizon, give heavy queues fewer processes and higher timeouts. Keep the default queue snappy for UX-critical work.</p>

<h2>Idempotency beats cleverness</h2>
<p>Jobs can run more than once. Design them that way. Use idempotency keys for payment side effects, “already sent” flags for receipts, and upserts instead of blind inserts. At-least-once delivery is normal; exactly-once is a myth you should not bet the ledger on.</p>

<h2>Failed jobs are a product feature</h2>
<p>Enable the failed jobs table and actually look at it. Alert when failed count spikes. Provide an admin action to retry after a fix. Deleting failed rows without reading them is how you hide production bugs.</p>
<pre><code>php artisan queue:failed
php artisan queue:retry {id}
</code></pre>

<h2>Supervision and deploys</h2>
<p>Run workers under Supervisor or systemd. On deploy, restart workers gracefully so old code does not process new job payloads. Horizon’s terminate command exists for this reason.</p>
<p>Health-check queue lag: if waiting jobs climb while workers are “up,” you are already late.</p>

<h2>Production checklist</h2>
<ol>
<li>Separate queues by urgency and cost.</li>
<li>Document tries/backoff/timeout per job class.</li>
<li>Monitor lag, failure rate, and processing time.</li>
<li>Make jobs idempotent.</li>
<li>Test poison messages in staging.</li>
<li>Restart workers on every release.</li>
</ol>
<p>Laravel queues are simple to start and easy to run poorly. Treat retries and timeouts as product decisions — your users only see the outcome.</p>
`,

  "saas-pricing-page-that-converts": `
<h2>Pricing is a clarity problem</h2>
<p>Buyers do not bounce because they hate paying. They bounce because they cannot tell which plan fits, what happens at the limit, or what the CTA commits them to. A converting pricing page answers those questions above the fold.</p>

<h2>Start with packaging, not colors</h2>
<p>Most products need three plans:</p>
<ul>
<li><strong>Starter</strong> — solo / trial-friendly</li>
<li><strong>Growth</strong> — the plan you want most buyers on</li>
<li><strong>Scale</strong> — teams, SSO, higher limits, human support</li>
</ul>
<p>If every plan includes everything, you do not have packaging — you have a discount ladder. Differentiate with limits and workflow unlocks, not vanity feature checkmarks.</p>

<h2>Name plans for the buyer’s job</h2>
<p>“Pro” and “Premium” are empty. Prefer names tied to outcomes or company size when it helps scanning. Still keep the visual hierarchy obvious: recommended plan gets the strongest border and CTA.</p>

<h2>Limits must be specific</h2>
<p>Vague copy like “unlimited-ish” destroys trust. State seats, projects, API calls, storage, and support channel. Explain overage behavior: hard block, soft warn, or auto-upgrade. Surprises after signup create chargebacks.</p>

<h2>Annual toggle without tricks</h2>
<p>Default to the period your business prefers, but show monthly equivalent clearly. Do not hide the monthly price behind a puzzle. Savings badges help when the math is honest.</p>

<h2>CTA patterns that reduce friction</h2>
<ul>
<li>Primary CTA: “Start Free Trial” or “Get Started” — one verb.</li>
<li>Secondary: “Talk to sales” only on the top tier.</li>
<li>Avoid five competing buttons per card.</li>
</ul>
<p>If trial needs a card, say so near the button. Card-required trials convert differently than no-card trials — pick deliberately and write truthfully.</p>

<h2>Social proof next to money</h2>
<p>Place a short testimonial, logo row, or “used by X teams” near the pricing grid. Trust belongs beside the ask. Keep claims verifiable.</p>

<h2>FAQ belongs on the page</h2>
<p>Answer refunds, cancellation, data export, and “can I change plans later?” on the same URL. Sending people to a separate help center mid-decision leaks conversion.</p>

<h2>Instrumentation</h2>
<p>Track: pricing view → plan select → signup start → signup complete → paid. If plan select is high and signup is low, the checkout is the leak. If pricing view is high and select is low, packaging/copy is the leak.</p>

<h2>Ship checklist</h2>
<ol>
<li>Three clear tiers with one recommended plan.</li>
<li>Numeric limits and overage rules.</li>
<li>Honest annual savings math.</li>
<li>One primary CTA per plan.</li>
<li>On-page FAQ for money objections.</li>
<li>Events wired before the redesign “feels done.”</li>
</ol>
<p>A pricing page that converts is mostly honest structure. Design polish helps — ambiguity kills.</p>
`,

  "multi-vendor-marketplace-playbook": `
<h2>Why multi-vendor is hard</h2>
<p>A single-store shop has one inventory owner, one price list, and one payout account. A marketplace has many vendors, shared catalog rules, commission math, and dispute flows. If you model it like a normal ecommerce app, you will rewrite the schema within months.</p>
<p>This guide walks through a production-minded structure for vendor splits, commissions, and inventory sync — the three areas that break most MVPs.</p>

<h2>Core entities you actually need</h2>
<p>Start with clear ownership boundaries:</p>
<ul>
<li><strong>Platform</strong> — owns users, orders, payments, dispute policy, and global catalog rules.</li>
<li><strong>Vendor</strong> — owns products (or offers), stock for their listings, shipping SLAs, and payout destination.</li>
<li><strong>Customer</strong> — buys across vendors in one cart, but fulfillment may split.</li>
</ul>
<p>In Laravel terms, keep <code>vendors</code>, <code>vendor_users</code>, <code>products</code> (or <code>listings</code>), <code>order_items</code> with <code>vendor_id</code>, and a separate <code>payouts</code> ledger. Do not bury vendor identity only inside product metadata.</p>

<h2>Commission models that scale</h2>
<p>Pick one primary model and document edge cases early:</p>
<ul>
<li><strong>Percentage of item subtotal</strong> — simplest; exclude shipping/tax unless contract says otherwise.</li>
<li><strong>Tiered percentage</strong> — volume discounts for top vendors; store rules in config, not hard-coded ifs.</li>
<li><strong>Flat + percentage</strong> — useful for low-ticket items so platform economics stay healthy.</li>
</ul>
<p>Store the resolved commission on each <code>order_item</code> at purchase time. Rates change; historical payouts must stay auditable. A nightly job that recalculates old orders from live rates will create finance nightmares.</p>

<pre><code>order_items
- vendor_id
- product_id
- unit_price
- quantity
- commission_rate_bps
- commission_amount
- vendor_net_amount
</code></pre>

<p>Use basis points (<code>commission_rate_bps</code>) instead of floats when money accuracy matters.</p>

<h2>Payout schedules</h2>
<p>Most marketplaces hold funds until a return window closes. A practical default:</p>
<ul>
<li>Order paid → funds in <em>pending</em> for vendor.</li>
<li>Delivery confirmed + return window ends → move to <em>available</em>.</li>
<li>Weekly transfer job pays <em>available</em> balance minus reserves.</li>
</ul>
<p>Keep a double-entry style ledger (<code>vendor_ledger_entries</code>) rather than mutating a single balance column. Credits for sales, debits for refunds, fees, and payouts. Your support team will thank you when a vendor asks “where did ₹2,400 go?”</p>

<h2>Inventory without chaos</h2>
<p>Decide whether stock is platform-owned or vendor-owned. For vendor-owned stock:</p>
<ul>
<li>Decrement on order placement (soft reserve) or payment success — pick one and stick to it.</li>
<li>Release reserve on cancel/timeout.</li>
<li>Sync external ERP stock through idempotent webhooks with an <code>external_stock_version</code>.</li>
</ul>
<p>Never let two vendors share one mutable stock row unless you intentionally sell marketplace-fulfilled inventory. Shared SKUs need offer rows: same product identity, different vendor, price, and stock.</p>

<h2>Admin, vendor, and customer APIs</h2>
<p>Separate policy surfaces:</p>
<ul>
<li><strong>Admin API</strong> — approve vendors, adjust commissions, freeze payouts, resolve disputes.</li>
<li><strong>Vendor API</strong> — manage listings, view orders for their vendor_id only, request payouts.</li>
<li><strong>Customer API</strong> — cart/checkout with multi-vendor shipping quotes.</li>
</ul>
<p>In Laravel, scope every vendor query with a middleware or policy that injects <code>vendor_id</code> from the authenticated vendor user. A missing scope is a data leak, not a “small bug.”</p>

<h2>Checkout UX for multi-vendor carts</h2>
<p>Customers expect one checkout. Behind the scenes you may create one payment intent and multiple shipment groups. Show shipping per vendor early so sticker shock does not kill conversion after payment authorization.</p>
<p>If one vendor cannot fulfill, prefer partial cancel with automatic refund of that slice — do not void the whole order unless your policy requires it.</p>

<h2>MVP checklist</h2>
<ol>
<li>Vendor onboarding + KYC fields you actually verify.</li>
<li>Item-level commission snapshot.</li>
<li>Ledger-based balances.</li>
<li>Return window before payout.</li>
<li>Vendor-scoped authorization tests.</li>
<li>Refund path that reverses commission correctly.</li>
</ol>
<p>Ship those six before fancy vendor analytics. Architecture debt in marketplaces compounds faster than in single-store apps — clean boundaries early are the entire playbook.</p>
`,

  "react-laravel-stack-2025": `
<h2>The rumor vs the invoice</h2>
<p>Every year someone declares React + Laravel outdated. Meanwhile agencies still ship client work on that stack because hiring is easier, docs are mature, and the path from prototype to production is short. “Winning” here means shipping reliable product, not winning Twitter arguments.</p>

<h2>When this stack is the right call</h2>
<ul>
<li>You need a solid admin/back-office quickly (Filament or similar).</li>
<li>Your product is form/workflow heavy with clear domain rules.</li>
<li>You want one backend team comfortable with SQL, queues, and auth.</li>
<li>The frontend is a product UI, not a content marketing site that needs edge ISR everywhere.</li>
</ul>
<p>Reach for Next.js-heavy architectures when SEO landing pages, marketing sites, and app shell share one deploy — or when your team already lives in the React Server Components world.</p>

<h2>API styles that work in 2025</h2>
<p><strong>Laravel API + React SPA</strong> remains the default for dashboards. Use Sanctum cookie/session auth for first-party SPAs on related domains, and token abilities for mobile clients.</p>
<p><strong>Inertia</strong> collapses the API ceremony when the UI is mostly server-driven screens. You keep Laravel routing and validation while writing React pages. Great for admin and internal tools.</p>
<p><strong>Next.js frontend + Laravel API</strong> fits public marketing + authenticated app. Put the Next app on Vercel, API on your VPS/Hostinger, and be strict about CORS or same-origin proxies.</p>

<h2>Sanctum vs Passport vs JWT</h2>
<ul>
<li><strong>Sanctum</strong> — first choice for first-party SPA/mobile. Lightweight, first-class Laravel support.</li>
<li><strong>Passport (OAuth2)</strong> — when third-party developers need delegated access.</li>
<li><strong>Custom JWT</strong> — only if you have a real interop requirement; otherwise you own every edge case Sanctum already solved.</li>
</ul>
<p>Most SaaS products never need Passport on day one. Add it when a partner integration demands OAuth scopes.</p>

<h2>Structuring the API layer</h2>
<p>Keep controllers thin. Put domain rules in actions/services. Return API Resources so frontend contracts stay stable when columns rename. Version at least psychologically: <code>/api/v1</code> even if you only have one version today.</p>
<p>Use Form Requests for validation and policies for authorization. “We’ll add policies later” is how tenant data leaks into the wrong account.</p>

<pre><code>// Example mental model
Route::middleware('auth:sanctum')->group(function () {
  Route::apiResource('projects', ProjectController::class);
});
</code></pre>

<h2>Frontend conventions that reduce thrash</h2>
<ul>
<li>One API client with auth header/cookie handling.</li>
<li>Typed DTOs matching Laravel Resources.</li>
<li>Server state library (React Query / SWR) for lists and mutations.</li>
<li>Feature folders over dumping everything in <code>components/</code>.</li>
</ul>

<h2>Performance habits</h2>
<p>Eager-load relationships. Paginate everything. Queue emails and webhooks. Cache read-heavy reference data. On the React side, avoid fetching the same bootstrap payload five times — load site settings once at the shell.</p>

<h2>When to leave the stack</h2>
<p>If your product is realtime-collab first, or you need a specialized runtime, evaluate alternatives. Do not rewrite because a conference talk called your stack boring. Boring stacks pay rent.</p>
<p>React + Laravel still wins in 2025 for the same reason spreadsheets still win: teams finish work.</p>
`,

  "dark-ui-that-converts": `
<h2>Dark mode is not a theme toggle</h2>
<p>Teams often flip backgrounds to near-black, keep the same spacing, and wonder why conversion drops. Dark UI fails when hierarchy disappears. Contrast, elevation, and CTA placement matter more than glass blur.</p>

<h2>Rule 1: Build a luminance scale, not two colors</h2>
<p>Define surfaces explicitly:</p>
<ul>
<li>Base canvas (lowest)</li>
<li>Raised panel</li>
<li>Overlay / popover</li>
<li>Input field</li>
<li>Active / selected</li>
</ul>
<p>Each step should be noticeable without neon borders. If cards vanish into the page, users cannot scan pricing tables or feature grids.</p>

<h2>Rule 2: Text contrast beats aesthetic gray</h2>
<p>Muted body text on charcoal looks “premium” in screenshots and fails accessibility in real rooms with glare. Aim for readable body copy first. Use lower-contrast text only for tertiary metadata.</p>
<p>Test primary buttons in both resting and hover states against the darkest and lightest surfaces you ship.</p>

<h2>Rule 3: Elevation with borders and light, not only shadow</h2>
<p>Shadows are subtler on dark canvases. Combine:</p>
<ul>
<li>1px border at ~10–16% white opacity</li>
<li>Soft ambient shadow</li>
<li>Optional top highlight gradient for “glass” panels</li>
</ul>
<p>Glassmorphism works when content behind is calm. Over a busy chart, frosted panels become noise. Limit glass to nav, modals, and hero marketing — not every KPI card.</p>

<h2>Rule 4: One loud CTA per decision zone</h2>
<p>Dark themes tempt designers to make everything glow. Glow is a hierarchy tool. Primary upgrade/checkout actions get the bright fill. Secondary actions stay outline or quiet solid.</p>
<p>On pricing pages, keep monthly/yearly toggle and the recommended plan CTA as the only high-chroma elements in the fold.</p>

<h2>Micro-interactions that guide upgrades</h2>
<ul>
<li>Plan cards: slight lift + border brighten on hover.</li>
<li>Feature comparison: highlight the column of the selected plan.</li>
<li>Checkout: progress steps with clear completed state (not just gray checkmarks).</li>
</ul>
<p>Motion should confirm state change in under 200ms. Decorative loops that never resolve feel cheap.</p>

<h2>SaaS dashboard specifics</h2>
<p>Dashboards pack dense data. Use denser type, tighter tables, and stronger separation between nav and canvas. Put destructive actions behind confirmation; red on dark can look stylish and still be missed if contrast is weak.</p>
<p>Charts need gridlines that do not dominate. Prefer desaturated series colors with one accent series for the KPI you want noticed.</p>

<h2>Implementation tips (CSS tokens)</h2>
<pre><code>:root {
  --bg: #0b0d10;
  --surface: #12151a;
  --surface-2: #1a1f27;
  --border: rgba(255,255,255,.12);
  --text: #eef2f7;
  --muted: #9aa3b2;
  --accent: #5b8cff;
}
</code></pre>
<p>Keep tokens boring and shared. Arbitrary one-off hex values are how dark themes rot.</p>

<h2>Ship checklist</h2>
<ol>
<li>Surface scale documented.</li>
<li>Body text contrast verified.</li>
<li>Primary CTA unique in each fold.</li>
<li>Focus rings visible on dark backgrounds.</li>
<li>Empty states and errors designed — not afterthoughts.</li>
</ol>
<p>Dark UI that converts is disciplined hierarchy wearing a stylish coat — not the coat alone.</p>
`,

  "nextjs-15-cheat-sheet": `
<h2>Keep the mental model small</h2>
<p>Next.js App Router feels huge until you map decisions to a few questions: Is this HTML public? Does it need personalization? How fresh must data be? This cheat sheet is that decision tree in prose.</p>

<h2>Server Components by default</h2>
<p>In the App Router, components are Server Components unless you add <code>"use client"</code>. Fetch data on the server when you can. Push client components to the leaves: buttons, charts, inputs, anything that needs browser APIs.</p>
<p>If a file imports hooks or event handlers, it must be a client component. Do not mark entire pages as client just to use one interactive widget — split the widget out.</p>

<h2>Caching in plain language</h2>
<ul>
<li><strong>Static by default</strong> for fetch without opt-outs in many setups — great for marketing content.</li>
<li><strong>Revalidate</strong> with <code>next: { revalidate: N }</code> when content can be slightly stale.</li>
<li><strong>No store</strong> when the response is user-specific or must be live.</li>
</ul>
<p>If something “randomly” looks cached, check fetch cache options and whether the route is statically prerendered. Layouts can cache more aggressively than you expect.</p>

<h2>loading.tsx and streaming</h2>
<p>Add <code>loading.tsx</code> for route-level skeletons. Users see structure while slow upstream APIs respond. Pair with Suspense boundaries around heavy sections so the hero can paint before the archive grid.</p>

<h2>Metadata that is not an afterthought</h2>
<p>Export <code>generateMetadata</code> for dynamic posts. Set title, description, canonical, and Open Graph image. For a magazine site, unique metadata per article is basic SEO hygiene and helps ad quality reviews that look for real pages.</p>

<pre><code>export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return { title: post.title, description: post.excerpt };
}
</code></pre>

<h2>Parallel routes and layouts</h2>
<p>Use layouts for chrome (nav/footer). Use parallel routes when you truly need independent slots (e.g., modal + page). Most products never need intercepting routes on day one — learn them when a UX requires it.</p>

<h2>Server Actions vs Route Handlers</h2>
<ul>
<li><strong>Server Actions</strong> — form mutations colocated with UI, progressive enhancement friendly.</li>
<li><strong>Route Handlers</strong> — public webhooks, third-party callbacks, non-form API surfaces.</li>
</ul>
<p>Do not put secret keys in client bundles. Server Actions and Route Handlers run on the server; treat inputs as untrusted.</p>

<h2>Sprint planning prompts</h2>
<ol>
<li>Public SEO page? Prefer server fetch + revalidate.</li>
<li>Auth dashboard? Dynamic rendering, careful caching.</li>
<li>One interactive island? Client component leaf.</li>
<li>Webhook from Stripe? Route Handler + signature verify.</li>
<li>Marketing experiment? Feature flag on server before HTML ships.</li>
</ol>
<p>Tape this list next to your monitor. Next.js 15 rewards boring decisions repeated consistently.</p>
`,

  "api-auth-without-tears": `
<h2>Choose auth by product stage</h2>
<p>Auth debates get religious. Product stage should decide:</p>
<ul>
<li><strong>MVP web app</strong> — Laravel Sanctum SPA cookie auth.</li>
<li><strong>Mobile + web</strong> — Sanctum token abilities or Passport if partners need OAuth.</li>
<li><strong>Multi-tenant SaaS</strong> — Sanctum/Passport plus tenancy guardrails (tenant_id on every row you care about).</li>
</ul>
<p>JWT-from-scratch is rarely the MVP win. You want session fixation protections, CSRF strategy, and revocation already solved.</p>

<h2>Sanctum SPA pattern</h2>
<p>First-party SPA on a subdomain: CSRF cookie, then login, then authenticated JSON requests with cookies. Configure <code>SANCTUM_STATEFUL_DOMAINS</code> and CORS carefully. Same-origin proxies (Next rewrite to Laravel) often remove entire classes of CORS bugs.</p>

<h2>Token auth for mobile</h2>
<p>Issue personal access tokens with narrow abilities. Store tokens in secure storage on device. Rotate on password change. Provide a revoke endpoint and an admin “logout all sessions” tool.</p>

<pre><code>$user->createToken('mobile', ['orders:read', 'orders:write']);
</code></pre>

<h2>Middleware recipes worth copying</h2>
<ul>
<li>Force JSON responses on API routes.</li>
<li>Throttle login and password reset harder than general API traffic.</li>
<li>Abort if <code>Accept</code> / content negotiation looks like scrapers hitting HTML login with credential stuffing.</li>
<li>Log auth failures with IP + user identifier without logging passwords.</li>
</ul>

<h2>Multi-tenant pitfalls</h2>
<p>Auth proves <em>who</em>. Tenancy proves <em>which account</em>. A valid user hitting another tenant’s <code>project_id</code> is an IDOR bug. Use global scopes or explicit policy checks. Add feature tests that create two tenants and assert cross-access returns 404/403.</p>

<h2>Refresh and expiry</h2>
<p>If you use short-lived tokens, define refresh clearly. Silent refresh races cause “random logouts.” Prefer one refresh endpoint with rotation and reuse detection if security requirements demand it.</p>

<h2>Rate limits that match reality</h2>
<p>Login: strict. Authenticated CRUD: generous but not infinite. Webhooks: verify signatures before expensive work. Expensive AI endpoints: per-user quotas separate from general API limits.</p>

<h2>Shipping checklist</h2>
<ol>
<li>Password hashing defaults (bcrypt/argon) unchanged for the worse.</li>
<li>HTTPS everywhere; secure cookie flags set.</li>
<li>Email verification if the product depends on inbox ownership.</li>
<li>2FA plan for admin users at minimum.</li>
<li>Session revoke UI.</li>
</ol>
<p>API auth without tears is mostly choosing Sanctum for the common case, testing tenant boundaries, and refusing clever cryptography until you have a threat model that needs it.</p>
`,

  "saas-launch-30-day-plan": `
<h2>Launch week is activation week</h2>
<p>Features do not launch products — activation does. A 30-day plan focuses on billing readiness, onboarding clarity, and the few emails that prevent silent churn.</p>

<h2>Days 1–7: Billing and truth in packaging</h2>
<ul>
<li>Finalize plan names, limits, and what “unlimited” actually means.</li>
<li>Stripe (or equivalent) products mapped 1:1 to plan codes in your DB.</li>
<li>Trial length decided; card-upfront vs card-optional chosen deliberately.</li>
<li>Failed payment dunning path sketched even if automation comes later.</li>
</ul>
<p>Write the pricing page copy before polishing animations. Ambiguous limits create support load and refunds.</p>

<h2>Days 8–14: Onboarding that creates an “aha”</h2>
<p>Pick one activation metric: first project created, first API key issued, first campaign sent. Design empty states that push that action. Remove sidebar noise until the user completes setup.</p>
<p>Checklist onboarding beats a 12-step wizard when each step is optional fluff.</p>

<h2>Days 15–21: The three emails that matter</h2>
<ol>
<li><strong>Welcome + next step</strong> — one CTA to the activation action.</li>
<li><strong>Day 3 nudges</strong> — only if activation incomplete; show how others succeed.</li>
<li><strong>Day 7 value proof</strong> — metrics, template, or shortcut that makes the product feel alive.</li>
</ol>
<p>Write like a helpful teammate. Avoid “We’re excited to announce our revolutionary…” — users delete that.</p>

<h2>Days 22–27: Support and trust</h2>
<ul>
<li>Public status page or at least a status section.</li>
<li>Refund / cancellation policy linked from billing UI.</li>
<li>In-app contact path that includes plan + account id automatically.</li>
</ul>

<h2>Days 28–30: Soft launch discipline</h2>
<p>Invite a small cohort. Watch session recordings or funnels for drop-offs on pricing → signup → first action. Fix the top two leaks before a big social blast.</p>
<p>Instrument events: signup, onboarding_complete, trial_start, paid_convert, cancel. Without events you are guessing.</p>

<h2>Transactional email hygiene</h2>
<p>Use a proper ESP. Set SPF/DKIM/DMARC. Separate marketing and transactional streams. Include unsubscribe on marketing; keep receipts transactional and short.</p>

<h2>Post-launch week one</h2>
<p>Daily check: activation rate, payment failures, top support question. Ship one onboarding improvement every 48 hours. That cadence beats a month of silent “brand building.”</p>
`,

  "indie-hacker-revenue-stack": `
<h2>Systems beat vibes</h2>
<p>Indie revenue looks glamorous in screenshots. Underneath it is usually a boring loop: publish helpful work, capture attention, offer a product, deliver fast, ask for the next step. This stack is content → trust → product → retention.</p>

<h2>Layer 1: Newsletter as home base</h2>
<p>Own an email list. Algorithms rent you attention; email lets you show up on Tuesday regardless of feed mood. Keep issues short and useful. Archive them on your site as lasting SEO pages — which also helps ad and sponsorship quality.</p>

<h2>Layer 2: Digital products</h2>
<p>Turn repeated questions into a PDF, template pack, boilerplate, or mini-course. Price for impulse first ($19–$79) before enterprise packages. Deliver immediately. Refund policy should be clear and calm.</p>
<p>Your best product ideas hide in your support DMs and comment sections.</p>

<h2>Layer 3: YouTube or long-form demos</h2>
<p>Video builds trust for developer tools. One thorough tutorial that ranks can outperform twenty short clips. Link the newsletter and product from descriptions without turning every minute into a pitch.</p>

<h2>Funnel sketch</h2>
<ol>
<li>Tutorial / issue solves a sharp problem.</li>
<li>CTA offers a related template or kit.</li>
<li>Purchase delivers fast win.</li>
<li>Follow-up offers adjacent product or subscription.</li>
</ol>
<p>Measure conversion at each step. Vanity follower counts do not pay hosting bills.</p>

<h2>Ops that keep you sane</h2>
<ul>
<li>One storefront (Gumroad, Lemon Squeezy, Stripe Payment Links — pick one).</li>
<li>One analytics view for sales + subscribers.</li>
<li>Content calendar realistic for a solo schedule.</li>
<li>Customer FAQ doc to prevent repeating yourself.</li>
</ul>

<h2>What $8K/mo usually looks like</h2>
<p>Not one viral hit forever — a mix of product sales, occasional sponsorships, and retainers or cohorts. Diversify lightly; do not open five storefronts. Deepen one audience.</p>

<h2>Ethics and longevity</h2>
<p>Do not fake testimonials. Do not scrape content. Do not promise income miracles. The indie stack works when the teaching is real and the product removes hours of work for buyers.</p>
`,

  "tailwind-at-scale": `
<h2>The 400-line config smell</h2>
<p>When <code>tailwind.config</code> becomes a dumping ground for one-off colors and spacing, the design system has already drifted. Scaling Tailwind means fewer decisions at call sites and more shared tokens.</p>

<h2>Design tokens first</h2>
<p>Define brand colors, surfaces, radii, shadows, and type sizes as tokens. Map them into Tailwind theme extension once. Components should reference <code>bg-surface</code>, <code>text-muted</code>, <code>rounded-card</code> — not raw hex.</p>

<h2>Component layers</h2>
<ul>
<li><strong>Primitives</strong> — Button, Input, Badge.</li>
<li><strong>Patterns</strong> — FormField, PageHeader, EmptyState.</li>
<li><strong>Features</strong> — PricingTable, CheckoutForm.</li>
</ul>
<p>Primitives own variants. Features compose primitives. When features invent new button styles, the system is leaking.</p>

<h2>cn() and variants</h2>
<p>Use a tiny <code>cn()</code> helper (clsx + tailwind-merge) to resolve class conflicts. For complex components, a variant helper (CVA or similar) keeps props honest: <code>size</code>, <code>tone</code>, <code>fullWidth</code>.</p>

<pre><code>button({ tone: 'primary', size: 'md' })
</code></pre>

<h2>When to stop adding arbitrary values</h2>
<p><code>mt-[13px]</code> is a smell unless it matches a screenshot-perfect marketing layout. Prefer the spacing scale. If designers need 13px often, add a token — do not sprinkle magic numbers.</p>

<h2>Document decisions</h2>
<p>Keep a short CONTRIBUTING note: how to add a color, when to create a primitive, banned patterns (inline hex, huge custom CSS files for one button). New teammates scale the system only if rules are written down.</p>

<h2>Tailwind v4-era habits</h2>
<p>Whether you are on v3 or v4, the principle holds: utility classes are an implementation detail of a design system, not a replacement for one. Pair utilities with shared React primitives and you get speed without chaos.</p>

<h2>Refactor plan for a messy codebase</h2>
<ol>
<li>Extract color/spacing tokens from the wildest screens.</li>
<li>Replace duplicated button class strings with a Button primitive.</li>
<li>Ban new arbitrary values in lint review.</li>
<li>Delete unused theme keys quarterly.</li>
</ol>
<p>Tailwind at scale is mostly restraint — and a Button component you trust.</p>
`,
};

/** Prefer full local bodies when API/CMS content is too thin for AdSense quality. */
export function enrichPostContent<T extends { slug: string; content: string; readTime?: string }>(
  post: T
): T {
  const body = articleBodies[post.slug]?.trim();
  if (!body) return post;

  const plain = post.content.replace(/<[^>]+>/g, "").trim();
  if (plain.length >= 600) return post;

  return {
    ...post,
    content: body,
    readTime: "9 min read",
  };
}

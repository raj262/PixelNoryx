<?php

namespace Database\Seeders;

use App\Models\AdPlacement;
use App\Models\Category;
use App\Models\Faq;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Support\SiteContent;
use App\Models\Subscriber;
use App\Models\Tag;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::where('email', 'admin@pixelnoryx.demo')->first();

        $topics = [
            'React.js', 'Laravel', 'UI/UX', 'Ecommerce', 'APIs', 'SaaS', 'Startup', 'Frontend',
        ];

        $categories = [];
        foreach ($topics as $i => $topic) {
            $categories[$topic] = Category::firstOrCreate(
                ['slug' => Str::slug($topic)],
                ['name' => $topic, 'is_active' => true, 'sort_order' => $i]
            );
        }

        $posts = [
            [
                'issue_number' => 42,
                'slug' => 'multi-vendor-marketplace-playbook',
                'title' => 'The Multi-Vendor Marketplace Playbook',
                'topic' => 'Ecommerce',
                'excerpt' => 'How to architect vendor splits, commissions, and inventory without drowning in complexity.',
                'preview' => "Hey — this week we're breaking down the exact database schema and API patterns behind production multi-vendor stores...",
                'image' => 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80',
                'is_featured' => true,
                'is_sponsored' => true,
                'comment_count' => 2,
            ],
            [
                'issue_number' => 41,
                'slug' => 'react-laravel-stack-2025',
                'title' => 'Why React + Laravel Still Wins in 2025',
                'topic' => 'React.js',
                'excerpt' => 'The stack agencies secretly use for 80% of client projects.',
                'preview' => 'Every few months someone declares this stack dead. Meanwhile, agencies bill $50K+ projects with it.',
                'image' => 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
                'is_featured' => true,
                'comment_count' => 2,
            ],
            [
                'issue_number' => 40,
                'slug' => 'dark-ui-that-converts',
                'title' => 'Dark UI Patterns That Actually Convert',
                'topic' => 'UI/UX',
                'excerpt' => 'Glassmorphism is back — but only when you use these 4 rules for SaaS dashboards.',
                'preview' => 'Your dark mode isn\'t ugly. Your hierarchy is.',
                'image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
                'is_featured' => true,
            ],
        ];

        foreach ($posts as $i => $data) {
            $post = Post::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'category_id' => $categories[$data['topic']]->id,
                    'user_id' => $author?->id,
                    'issue_number' => $data['issue_number'],
                    'title' => $data['title'],
                    'excerpt' => $data['excerpt'],
                    'preview' => $data['preview'],
                    'content' => $data['excerpt'].' Full article content managed from admin panel.',
                    'image' => $data['image'],
                    'read_time' => '5 min read',
                    'is_featured' => $data['is_featured'] ?? false,
                    'is_free' => true,
                    'is_sponsored' => $data['is_sponsored'] ?? false,
                    'status' => 'published',
                    'published_at' => now()->subDays($i * 7),
                    'comment_count' => $data['comment_count'] ?? 0,
                ]
            );

            $tag = Tag::firstOrCreate(['slug' => Str::slug($data['topic'])], ['name' => $data['topic']]);
            $post->tags()->syncWithoutDetaching([$tag->id]);
        }

        $faqs = [
            [
                'question' => 'How often do you send the newsletter?',
                'answer' => 'Every Tuesday morning (UTC). Occasional bonus issues when we launch a major guide or product.',
            ],
            [
                'question' => 'Is it really free?',
                'answer' => 'Yes. Core issues are free forever. We may introduce optional paid deep-dives later — subscribers get first notice.',
            ],
            [
                'question' => 'Can I read past issues?',
                'answer' => 'All published issues live in the Archive. Browse by topic or search any keyword.',
            ],
            [
                'question' => 'How do I unsubscribe?',
                'answer' => 'One click at the bottom of every email. No guilt trips, no hoops.',
            ],
            [
                'question' => 'Do you sell my email?',
                'answer' => 'Never. Your email is only used for PixelNoryx newsletter and rare product updates you opt into.',
            ],
            [
                'question' => 'Can I sponsor an issue?',
                'answer' => 'We offer limited sponsor slots for dev tools and courses. Contact hello@pixelnoryx.com for rates.',
            ],
            [
                'question' => 'What topics do you cover?',
                'answer' => 'React, Laravel, SaaS, UI/UX, ecommerce, APIs, startups, and frontend architecture — practical tutorials and shipping advice, not hype.',
            ],
            [
                'question' => 'How long does each issue take to read?',
                'answer' => 'Most issues are designed as 5-minute reads with optional deep-dive links if you want to go further.',
            ],
            [
                'question' => 'Can I reply to the newsletter?',
                'answer' => 'Yes. Replies go straight to our inbox. We read every message and often feature reader questions in future issues.',
            ],
            [
                'question' => 'Do you offer an RSS feed?',
                'answer' => 'An RSS feed for the public archive is on our roadmap. Subscribe by email today and we will notify you when RSS launches.',
            ],
            [
                'question' => 'Can I contribute or guest post?',
                'answer' => 'We occasionally publish guest guides from experienced builders. Pitch your idea at hello@pixelnoryx.com with an outline and links to your work.',
            ],
            [
                'question' => 'Who writes PixelNoryx?',
                'answer' => 'PixelNoryx is edited by Rajesh Verma, a full-stack developer focused on ecommerce systems and teaching developers to ship faster.',
            ],
            [
                'question' => 'How do sponsored posts work?',
                'answer' => 'Sponsored slots are clearly labeled. We only partner with tools we would recommend to our own team. Ad placements on the site are scheduled with start and end dates.',
            ],
            [
                'question' => 'Is there a community or Discord?',
                'answer' => 'Not yet — we are building a small community for subscribers. Join the newsletter to get early access when it opens.',
            ],
            [
                'question' => 'What if I miss an issue?',
                'answer' => 'Visit the Archive anytime. Issues stay online and you can filter by category such as React, Laravel, or SaaS.',
            ],
            [
                'question' => 'How do I advertise on the website?',
                'answer' => 'Ad placements (header, sidebar, mid-page, footer) can be booked through our team. Use the contact form or email hello@pixelnoryx.com with your campaign dates.',
            ],
        ];

        foreach ($faqs as $i => $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                [
                    'answer' => $faq['answer'],
                    'sort_order' => $i + 1,
                    'is_active' => true,
                ]
            );
        }

        Testimonial::firstOrCreate(
            ['name' => 'Alex Chen'],
            [
                'role' => 'CTO, TechLaunch',
                'content' => 'Best dev newsletter I subscribe to.',
                'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
                'rating' => 5,
                'is_active' => true,
            ]
        );

        Subscriber::firstOrCreate(
            ['email' => 'demo@pixelnoryx.com'],
            ['name' => 'Demo Subscriber', 'is_active' => true, 'source' => 'seed']
        );

        $settings = [
            'site_name' => 'PixelNoryx',
            'tagline' => 'The Developer Dispatch',
            'description' => 'A free weekly newsletter on React, Laravel, SaaS, and shipping digital products.',
            'subscriber_count' => '12,400+',
            'frequency' => 'Every Tuesday',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::set($key, $value);
        }

        foreach (\App\Support\SeoSettings::defaults() as $key => $value) {
            if (! SiteSetting::query()->where('key', $key)->exists()) {
                SiteSetting::set($key, $value);
            }
        }

        $contentDefaults = SiteContent::defaults();
        SiteSetting::set('author_name', $contentDefaults['author_name']);
        SiteSetting::set('author_role', $contentDefaults['author_role']);
        SiteSetting::set('author_bio', $contentDefaults['author_bio']);
        SiteSetting::set('author_image', $contentDefaults['author_image']);
        SiteSetting::set('contact_email', $contentDefaults['contact_email']);
        SiteSetting::set('community_size', $contentDefaults['community_size']);
        SiteSetting::setJson('social_stats', $contentDefaults['social_stats']);
        SiteSetting::setJson('social_links', $contentDefaults['social_links']);
        SiteSetting::setJson('nav_links', $contentDefaults['nav_links']);
        SiteSetting::setJson('footer_links', $contentDefaults['footer_links']);
        SiteSetting::setJson('subscribe_benefits', $contentDefaults['subscribe_benefits']);

        $adSeeds = [
            ['placement_key' => 'header', 'size' => 'leaderboard', 'title' => 'Ship 10x Faster with NovaCommerce', 'subtitle' => 'Multi-vendor ecommerce · React + Laravel', 'cta' => 'View Demo', 'href' => '#', 'sponsor' => 'Sponsored', 'gradient_key' => 'violetSunset', 'sort_order' => 1],
            ['placement_key' => 'heroBelow', 'size' => 'billboard', 'title' => 'Premium Admin Dashboards for SaaS Teams', 'subtitle' => '50+ components · Dark mode · Lifetime updates', 'cta' => 'Shop Now', 'href' => '#', 'sponsor' => 'Advertisement', 'gradient_key' => 'slateHero', 'sort_order' => 2],
            ['placement_key' => 'sidebarTop', 'size' => 'rectangle', 'title' => 'APIForge Laravel', 'subtitle' => 'Production-ready REST APIs', 'cta' => 'Learn More', 'href' => '#', 'sponsor' => 'Ad', 'gradient_key' => 'ocean', 'sort_order' => 3],
            ['placement_key' => 'sidebarSticky', 'size' => 'skyscraper', 'title' => 'Developer Tools Week', 'subtitle' => 'Save 40% on all digital products', 'cta' => 'Get Offer', 'href' => '#', 'sponsor' => 'Sponsored', 'gradient_key' => 'brand', 'sort_order' => 4],
            ['placement_key' => 'inlineFeed', 'size' => 'native', 'title' => 'SaaSify Starter Kit', 'subtitle' => 'Auth, billing & teams built-in', 'cta' => 'Explore', 'href' => '#', 'sponsor' => 'Promoted', 'gradient_key' => 'indigo', 'sort_order' => 5],
            ['placement_key' => 'midPage', 'size' => 'billboard', 'title' => 'Join 12,400+ Developers', 'subtitle' => 'Weekly tips on React, Laravel & shipping products', 'cta' => 'Subscribe Free', 'href' => '/#subscribe', 'sponsor' => 'PixelNoryx', 'gradient_key' => 'editorial', 'sort_order' => 6],
            ['placement_key' => 'footerBanner', 'size' => 'leaderboard', 'title' => 'Your Ad Could Be Here', 'subtitle' => 'Reach developers & indie hackers · Contact us', 'cta' => 'Advertise', 'href' => '/#contact', 'sponsor' => 'Advertisement', 'gradient_key' => 'zinc', 'sort_order' => 7],
        ];

        $schedule = [
            'starts_at' => now()->toDateString(),
            'ends_at' => now()->addYear()->toDateString(),
        ];

        foreach ($adSeeds as $ad) {
            AdPlacement::updateOrCreate(
                ['placement_key' => $ad['placement_key']],
                array_merge($ad, ['is_active' => true], $schedule)
            );
        }
    }
}

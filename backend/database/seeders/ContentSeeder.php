<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Faq;
use App\Models\Post;
use App\Models\SiteSetting;
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

        Faq::firstOrCreate(
            ['question' => 'How often do you send the newsletter?'],
            [
                'answer' => 'Every Tuesday morning (UTC).',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

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
    }
}

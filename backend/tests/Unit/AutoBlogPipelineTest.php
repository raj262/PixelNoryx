<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Post;
use App\Services\AutoBlog\DuplicateChecker;
use App\Services\AutoBlog\QualityValidator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AutoBlogPipelineTest extends TestCase
{
    use RefreshDatabase;

    public function test_duplicate_checker_flags_exact_slug(): void
    {
        $category = Category::query()->create([
            'name' => 'React.js',
            'slug' => 'react-js',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        Post::query()->create([
            'category_id' => $category->id,
            'slug' => 'react-server-components',
            'title' => 'React Server Components',
            'content' => '<p>Hello</p>',
            'status' => 'draft',
        ]);

        $result = (new DuplicateChecker)->check(
            'Something Else',
            'react-server-components'
        );

        $this->assertTrue($result['is_duplicate']);
        $this->assertSame('Exact slug already exists.', $result['reason']);
    }

    public function test_quality_validator_requires_min_words(): void
    {
        $result = (new QualityValidator)->validate([
            'title' => 'Title',
            'slug' => 'title',
            'excerpt' => 'Excerpt',
            'content' => '<p>'.str_repeat('word ', 50).'</p>',
            'meta_title' => 'Meta',
            'meta_description' => 'Desc',
            'faqs' => [],
        ], [
            'min_words' => 1200,
            'max_words' => 2000,
        ]);

        $this->assertFalse($result['ok']);
        $this->assertNotEmpty($result['errors']);
    }

    public function test_quality_validator_passes_complete_article(): void
    {
        $body = '<p>'.str_repeat('developer guide word ', 650).'</p>';

        $result = (new QualityValidator)->validate([
            'title' => 'A Complete Guide',
            'slug' => 'a-complete-guide',
            'excerpt' => 'Useful excerpt',
            'content' => $body,
            'meta_title' => 'A Complete Guide',
            'meta_description' => 'Useful description for search engines and social.',
            'faqs' => [
                ['question' => 'Q1?', 'answer' => 'A1'],
                ['question' => 'Q2?', 'answer' => 'A2'],
                ['question' => 'Q3?', 'answer' => 'A3'],
            ],
        ], [
            'min_words' => 1200,
            'max_words' => 2000,
        ]);

        $this->assertTrue($result['ok']);
        $this->assertGreaterThanOrEqual(1200, $result['word_count']);
    }
}

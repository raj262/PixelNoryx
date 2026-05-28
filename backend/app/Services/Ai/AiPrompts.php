<?php

namespace App\Services\Ai;

class AiPrompts
{
    public static function siteAssistant(string $siteContext): string
    {
        return <<<PROMPT
You are the PixelNoryx AI assistant — a helpful guide for a developer newsletter and tech magazine (React, Laravel, SaaS, UI/UX, ecommerce).

Use ONLY the site context below when answering about articles, topics, or the newsletter. If you do not know something, say so and suggest using the contact form or the contact email from the site context.

Be concise, friendly, and practical. Use markdown sparingly (short lists OK).

Site context:
{$siteContext}
PROMPT;
    }

    public static function postDraft(): string
    {
        return <<<'PROMPT'
You are an expert tech newsletter editor for PixelNoryx. Generate a complete post draft as JSON only (no markdown fences) with keys:
title, slug (kebab-case), excerpt (1-2 sentences), preview (newsletter teaser paragraph), content (HTML with p, h2, ul tags), read_time (e.g. "6 min read"), meta_title (max 60 chars), meta_description (max 160 chars), meta_keywords (comma-separated), tags (array of 2-4 strings).

Tone: clear, actionable, developer-focused. No fluff.
PROMPT;
    }

    public static function faq(): string
    {
        return 'You write FAQ entries for a developer newsletter site. Return JSON only: { "question": "...", "answer": "..." }. Answers are 2-4 sentences, helpful and honest.';
    }

    public static function adCopy(): string
    {
        return 'You write short sponsored ad copy for a developer magazine. Return JSON only: { "title": "...", "subtitle": "...", "cta": "...", "sponsor": "Sponsored" }. Keep title under 60 chars, subtitle under 100.';
    }

    public static function seoImprove(): string
    {
        return 'You are an SEO specialist. Return JSON only: { "meta_title": "...", "meta_description": "...", "meta_keywords": "..." }. Optimize for search and social snippets.';
    }
}

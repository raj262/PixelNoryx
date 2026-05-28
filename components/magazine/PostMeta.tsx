import Link from "next/link";
import type { NewsletterIssue } from "@/lib/types";
import { getTopicColor } from "@/lib/topic-colors";

interface PostMetaProps {
  post: NewsletterIssue;
  showTopic?: boolean;
  light?: boolean;
}

export default function PostMeta({ post, showTopic = true, light = false }: PostMetaProps) {
  const comments = post.commentCount ?? 0;

  return (
    <div
      className={`meta-line flex flex-wrap items-center gap-x-2 gap-y-1 ${light ? "text-white/75 [&_.text-foreground]:text-white" : ""}`}
    >
      {showTopic && (
        <>
          <Link
            href={`/archive?topic=${encodeURIComponent(post.topic)}`}
            className={`category-badge ${getTopicColor(post.topic)} hover:underline`}
          >
            {post.topic}
          </Link>
          <span className="text-border">·</span>
        </>
      )}
      <span>
        By <span className="font-medium text-foreground">{post.author}</span>
      </span>
      <span className="text-border">·</span>
      <time dateTime={post.date}>{post.date}</time>
      <span className="text-border">·</span>
      <span>
        {comments} {comments === 1 ? "Comment" : "Comments"}
      </span>
    </div>
  );
}

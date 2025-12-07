import { ptSerif } from "@/app/fonts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostWithAuthor } from "@/domains/posts/posts.types";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostWithAuthor;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.createdAt));

  return (
    <article className="p-3">
      <h2 className="text-4xl font-extrabold">{post.title}</h2>
      <span className="italic text-muted-foreground text-sm">
        By @{post.author.username} on {formattedDate}
      </span>
      <p className={cn("my-5 text-lg", ptSerif.className)}>{post.content}</p>
    </article>
  );
}

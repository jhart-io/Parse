import { getPosts } from "@/app/actions/posts";
import { getCurrentUser } from "@/domains/auth/auth.service";
import { PostCard } from "./post-card";

export async function PostFeed() {
  const result = await getPosts();
  const currentUser = await getCurrentUser();

  if (!result.success || !result.data) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 text-center">
        <p className="text-muted-foreground">Failed to load posts</p>
      </div>
    );
  }

  const posts = result.data;

  if (posts.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 text-center">
        <p className="text-muted-foreground">
          No posts yet. Be the first to share!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUser?.personId} />
      ))}
    </div>
  );
}

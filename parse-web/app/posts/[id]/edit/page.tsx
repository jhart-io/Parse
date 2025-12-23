import { redirect } from "next/navigation";
import { getPost } from "@/app/actions/posts";
import { getSession } from "@/domains/auth/auth.service";
import { PostComposer } from "@/components/composer/post-composer";
import { Header } from "@/components/header";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const result = await getPost(id);

  if (!result.success || !result.data) {
    redirect("/");
  }

  const post = result.data;

  // Verify the user owns this post
  if (post.authorId !== session.personId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-12 px-4">
        <PostComposer
          username={session.username}
          initialTitle={post.title}
          initialContent={post.content}
          postId={id}
          mode="edit"
        />
      </div>
    </div>
  );
}

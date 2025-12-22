import { Header } from "@/components/header";
import { PostCard } from "@/components/feed/post-card";
import { getPublishedPostsByAuthor } from "@/domains/posts/posts.service";
import { getPersonByUsername } from "@/domains/persons/persons.service";
import { notFound } from "next/navigation";

interface PersonProfilePageProps {
  params: {
    username: string;
  };
}

export default async function PersonProfilePage({ params }: PersonProfilePageProps) {
  const person = await getPersonByUsername(params.username);

  if (!person) {
    notFound();
  }

  const posts = await getPublishedPostsByAuthor(person.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-full max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <p className="text-sm text-muted-foreground">@{person.username}</p>
          <h1 className="text-4xl font-extrabold mt-2">{person.displayName}</h1>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

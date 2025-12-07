import { PostComposer } from "@/components/composer/post-composer";
import { Header } from "@/components/header";
import { getSession } from "@/domains/auth/auth.service";
import { redirect } from "next/navigation";

export default async function ComposePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/compose");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-12 px-4">
        <PostComposer username={session.username} />
      </div>
    </div>
  );
}

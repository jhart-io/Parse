import { PostFeed } from "@/components/feed/post-feed";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-12">
        <PostFeed />
      </div>
    </div>
  );
}

"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { savePostDraft, publishPost } from "@/app/actions/posts";
import { validateWordCount } from "@/domains/posts/posts.validation";
import { ptSerif } from "@/app/fonts";
import { cn } from "@/lib/utils";

type FormState = {
  success: boolean;
  error?: string;
  data?: any;
} | null;

export function PostComposer({ username }: { username: string }) {
  const [content, setContent] = useState("");
  const [wordCountStatus, setWordCountStatus] = useState(validateWordCount(""));
  const router = useRouter();

  // Use React 19's useActionState for form handling
  const [publishState, publishAction, isPublishPending] = useActionState<
    FormState,
    FormData
  >(publishPost, null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setWordCountStatus(validateWordCount(newContent));
  };

  // Redirect to feed after successful publish
  useEffect(() => {
    if (publishState?.success && !publishState.data?.isDraft) {
      router.push('/');
    }
  }, [publishState, router]);

  return (
    <section className="w-full max-w-3xl mx-auto">
      <form className="space-y-4">
        <div className="space-y-2">
          <Input
            id="title"
            name="title"
            placeholder="Your new post"
            disabled={isLoading}
            className="border-none shadow-none text-4xl! font-extrabold"
          />
          <span className="italic text-muted-foreground text-sm ml-4">
            By @{username} right now
          </span>
        </div>

        <div className="space-y-2">
          <Textarea
            id="content"
            name="content"
            placeholder="Share your thoughts..."
            rows={8}
            value={content}
            onChange={handleContentChange}
            disabled={isLoading}
            required
            className={cn(
              "my-5 text-lg! border-none shadow-none ",
              ptSerif.className,
              !wordCountStatus.isValid ? "border-destructive" : ""
            )}
          />
        </div>

        {/* Hidden fields */}
        <input type="hidden" name="visibility" value="public" />

        {publishState?.error && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-sm text-destructive">{publishState.error}</p>
          </div>
        )}

        <div className="flex gap-3 justify-end items-center">
          <p
            className={`text-sm ${
              !wordCountStatus.isValid
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {wordCountStatus.message}
          </p>
          <Button
            type="submit"
            formAction={publishAction}
            disabled={isPublishPending || !wordCountStatus.isValid || !content.trim()}
          >
            {isPublishPending ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </form>
    </section>
  );
}

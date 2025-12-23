"use server";

import { revalidatePath } from "next/cache";
import {
  createPost as createPostService,
  getPublishedPosts as getPublishedPostsService,
  getPostById,
  updatePost as updatePostService,
  deletePost as deletePostService,
} from "@/domains/posts/posts.service";
import { getCurrentUser } from "@/domains/auth/auth.service";

type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Create a new post from form data
 */
export async function createPostAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Get current user
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to create a post",
      };
    }

    // Extract and structure form data
    const titleValue = formData.get("title");
    const topicValue = formData.get("topic");

    const rawData = {
      title: titleValue ? String(titleValue) : undefined,
      content: formData.get("content") as string,
      isDraft: formData.get("isDraft") === "true",
      visibility:
        (formData.get("visibility") as "public" | "followers" | "private") ||
        "public",
      topic: topicValue ? String(topicValue) : undefined,
    };

    // Create post via domain service
    const post = await createPostService({
      ...rawData,
      authorId: user.personId,
    });

    // Revalidate pages that display posts
    revalidatePath("/");
    revalidatePath("/compose");

    return {
      success: true,
      data: post,
    };
  } catch (error) {
    console.error("Error creating post:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Save a post as draft
 */
export async function savePostDraft(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  formData.set("isDraft", "true");
  return createPostAction(null, formData);
}

/**
 * Publish a post
 */
export async function publishPost(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  formData.set("isDraft", "false");
  return createPostAction(null, formData);
}

/**
 * Get all published posts
 */
export async function getPosts() {
  try {
    const posts = await getPublishedPostsService();
    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
      data: [],
    };
  }
}

/**
 * Get a post by ID
 */
export async function getPost(postId: string) {
  try {
    const post = await getPostById(postId);

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    return {
      success: true,
      data: post,
    };
  } catch (error) {
    console.error("Error fetching post:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Update an existing post
 */
export async function updatePost(
  postId: string,
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Get current user
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to update a post",
      };
    }

    // Get the post to verify ownership
    const post = await getPostById(postId);

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    // Verify the user owns this post
    if (post.authorId !== user.personId) {
      return {
        success: false,
        error: "You can only edit your own posts",
      };
    }

    // Extract and structure form data
    const titleValue = formData.get("title");
    const topicValue = formData.get("topic");

    const updateData = {
      title: titleValue ? String(titleValue) : undefined,
      content: formData.get("content") as string,
      isDraft: formData.get("isDraft") === "true",
      visibility:
        (formData.get("visibility") as "public" | "followers" | "private") ||
        "public",
      topic: topicValue ? String(topicValue) : undefined,
    };

    // Update post via domain service
    const updatedPost = await updatePostService(postId, updateData);

    // Revalidate pages that display posts
    revalidatePath("/");
    revalidatePath(`/posts/${postId}/edit`);

    return {
      success: true,
      data: updatedPost,
    };
  } catch (error) {
    console.error("Error updating post:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<ActionResult> {
  try {
    // Get current user
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to delete a post",
      };
    }

    // Get the post to verify ownership
    const post = await getPostById(postId);

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    // Verify the user owns this post
    if (post.authorId !== user.personId) {
      return {
        success: false,
        error: "You can only delete your own posts",
      };
    }

    // Delete the post
    await deletePostService(postId);

    // Revalidate pages that display posts
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting post:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

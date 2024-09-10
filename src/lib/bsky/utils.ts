import { postSchema, feedGeneratorSchema } from "../schemas";
import z from "zod";

export function isLabledSexual(post: z.infer<typeof postSchema>) {
  // TODO: we may also want to check post.record.labels[0].val === 'sexual'
  return post.labels.some((label) => label.val === "sexual");
}

export function feedRequiresAuth(feed: z.infer<typeof feedGeneratorSchema>) {
  const text = feed.description.toLowerCase() + feed.displayName.toLowerCase();
  // THIS IS A HACK
  // The API doesn't seem to specify if a feed requires auth.
  // This is an attempt to filter out feeds that mention "followers",
  // "following", etc. which is a good indicator if auth is required.
  return text.includes("follow") || text.includes("my bangers");
}

import { postSchema } from "../schemas";
import z from "zod";

export function isLabledSexual(post: z.infer<typeof postSchema>) {
  // TODO: we may also want to check post.record.labels[0].val === 'sexual'
  return post.labels.some((label) => label.val === "sexual");
}

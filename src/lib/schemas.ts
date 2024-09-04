import z from 'zod'

const accountSchema = z.object({
  did: z.string(),
  handle: z.string(),
  displayName: z.string().optional(),
  avatar: z.string().optional(),
  // associated: z.object({}),
  // labels: z.array(z.unknown()),
  createdAt: z.string().optional(),
}).strip()

export const postSchema = z.object({
  uri: z.string(),
  cid: z.string(),
  author: accountSchema,
  record: z.object({
    text: z.string().optional(),
  }).strip(),
  embed: z.object({
    '$type': z.string().optional(),
    images: z.array(z.object({
      thumb: z.string(),
      fullsize: z.string(),
      alt: z.string(),
      aspectRatio: z.object({
        height: z.number(),
        width: z.number(),
      })
    }).strip()).optional(),
  }).strip().optional(),
  replyCount: z.number().optional(),
  repostCount: z.number().optional(),
  likeCount: z.number().optional(),
  quoteCount: z.number().optional(),
  indexedAt: z.string(),
  viewer: z.object({
    threadMuted: z.boolean().optional(),
    like: z.string().optional(),
    embeddingDisabled: z.boolean().optional(),
  }).strip().optional(),
  // labels: z.array(z.unknown()),
}).strip()

export const repliesSchema = z.array(z.object({
  post: postSchema,
}).strip())

// export const postsSchema = z.array(postSchema)

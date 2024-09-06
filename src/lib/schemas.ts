import z from "zod";

export const accountSchema = z
  .object({
    did: z.string(),
    handle: z.string(),
    displayName: z.string().optional(),
    avatar: z.string().optional(),
    // associated: z.object({}),
    // labels: z.array(z.unknown()),
    createdAt: z.string().optional(),
    followersCount: z.number().optional(),
    followsCount: z.number().optional(),
    postsCount: z.number().optional(),
    description: z.string().optional(),
  })
  .strip();

// {
//   '$type': 'app.bsky.embed.record#view',
//   record: {
//     '$type': 'app.bsky.embed.record#viewRecord',
//     uri: 'at://did:plc:xy3lxva6bqrph3avrvhzck7q/app.bsky.feed.post/3l3dourvb6r2n',
//     cid: 'bafyreigrcbzrgcyyb4ycqo375sgejsozav3cel37lyysogmq6vfogbff4y',
//     author: {
//       did: 'did:plc:xy3lxva6bqrph3avrvhzck7q',
//       handle: 'nemtudo.me',
//       displayName: 'Nem Tudo',
//       avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:xy3lxva6bqrph3avrvhzck7q/bafkreig4ay4hg3ncxhlkbqpbl56isyucw6joq4pfwcgja6qz6kz3moblbe@jpeg',
//       associated: [Object],
//       labels: [],
//       createdAt: '2023-08-07T01:27:04.458Z'
//     },
//     value: {
//       '$type': 'app.bsky.feed.post',
//       createdAt: '2024-09-04T15:55:52.641Z',
//       embed: [Object],
//       facets: [Array],
//       langs: [Array],
//       text: 'FINALMENTE TRENDS TOPICS!!\n' +
//         '\n' +
//         'Criei uma extensão que adiciona Trends Topics ao BlueSky!\n' +
//         '\n' +
//         'Finalmente vamos poder saber do que estão falando aqui :)\n' +
//         '\n' +
//         'A extensão ainda melhora o design e arruma alguns bugs!\n' +
//         '\n' +
//         'Use agora mesmo: nemtudo.me/betterbluesky\n' +
//         '\n' +
//         'Like + RT pra ajudar ❤ #BetterBluesky'
//     },
//     labels: [],
//     likeCount: 6358,
//     replyCount: 457,
//     repostCount: 1684,
//     quoteCount: 540,
//     indexedAt: '2024-09-04T15:55:52.641Z',
//     embeds: [ [Object] ]
//   }
// }

export const embedPostSchema = z.object({
  uri: z.string(),
  cid: z.string(),
  author: accountSchema,
  value: z
    .object({
      text: z.string(),
      createdAt: z.string(),
    })
    .strip(),
  likeCount: z.number().optional(),
  replyCount: z.number().optional(),
  repostCount: z.number().optional(),
  quoteCount: z.number().optional(),
  indexedAt: z.string(),
});

export const postSchema = z
  .object({
    uri: z.string(),
    cid: z.string(),
    author: accountSchema,
    record: z
      .object({
        text: z.string().optional(),
        createdAt: z.string().optional(),
        facets: z
          .array(
            z.object({
              features: z
                .array(
                  z.object({
                    uri: z.string().optional(),
                  }),
                )
                .optional(),
              index: z.object({
                byteEnd: z.number(),
                byteStart: z.number(),
              }),
            }),
          )
          .optional()
          .catch(() => undefined),
      })
      .strip(),
    embed: z
      .object({
        $type: z.string().optional(),
        images: z
          .array(
            z
              .object({
                thumb: z.string(),
                fullsize: z.string(),
                alt: z.string(),
                aspectRatio: z
                  .object({
                    height: z.number(),
                    width: z.number(),
                  })
                  .optional(),
              })
              .strip(),
          )
          .optional(),
        record: embedPostSchema.optional().catch(() => undefined),
      })
      .strip()
      .optional(),
    replyCount: z.number().optional(),
    repostCount: z.number().optional(),
    likeCount: z.number().optional(),
    quoteCount: z.number().optional(),
    indexedAt: z.string(),
    viewer: z
      .object({
        threadMuted: z.boolean().optional(),
        like: z.string().optional(),
        embeddingDisabled: z.boolean().optional(),
      })
      .strip()
      .optional(),
    // labels: z.array(z.unknown()),
  })
  .strip();

export const repliesSchema = z.array(
  z
    .object({
      post: postSchema,
    })
    .strip(),
);

export const postsSchema = z.array(postSchema);

export const feedViewPostSchema = z
  .object({
    post: postSchema,
    reason: z
      .object({
        by: accountSchema,
      })
      .optional(),
  })
  .strip();

export const feedViewPostsSchema = z.array(feedViewPostSchema);

export const outputSchema = z.object({
  feed: feedViewPostsSchema,
  cursor: z.string().optional(),
});

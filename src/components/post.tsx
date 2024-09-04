import {
  PostView,
  ReasonRepost,
  ReplyRef,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { ProfileViewBasic } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import * as routes from "@/lib/routes";
import { RelativeTime } from "./relative-time.client";
import { cn } from "@/lib/utils";
import { abbriviateNumber } from "@/lib/format";
import { postSchema } from "@/lib/schemas";

import { Repost, ReplyOutlined } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { LikeButton } from "./like-button.client";

import z from "zod";

const imagesSchema = z.array(
  z
    .object({
      thumb: z.string(),
      fullsize: z.string(),
      alt: z.string(),
      aspectRatio: z.object({
        height: z.number(),
        width: z.number(),
      }),
    })
    .strip(),
);

function parseImages(
  images: unknown,
): z.infer<typeof imagesSchema> | undefined {
  try {
    return imagesSchema.parse(images);
  } catch (e) {
    return undefined;
  }
}

const reasonRepost = z
  .object({
    by: z.object({
      did: z.string(),
      handle: z.string(),
      displayName: z.string(),
      avatar: z.string(),
      // associated: z.object({}),
      // labels: z.array(z.unknown()),
      // createdAt: z.string(),
    }),
  })
  .strip();

function parseReasonRepost(
  reason: ReasonRepost | { [k: string]: unknown; $type: string } | undefined,
) {
  try {
    return reasonRepost.parse(reason);
  } catch (e) {
    return null;
  }
}

function Images({ images }: { images: z.infer<typeof imagesSchema> }) {
  if (images.length === 2 || images.length === 4) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, i) => (
          <div key={i} className="relative aspect-[1/1]">
            <Image
              src={image.fullsize}
              alt={image.alt}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-3 grid-rows-2 gap-2">
        {images.map((image, i) => (
          <div
            key={i}
            className={cn(
              "relative aspect-[1/1]",
              i === 0 ? "col-span-2 row-span-2" : "col-span-1",
            )}
          >
            <Image
              src={image.fullsize}
              alt={image.alt}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    );
  }
}

export function Post({
  post,
  reply,
  reason,
}: {
  post: z.infer<typeof postSchema> | PostView;
  reply?: ReplyRef;
  reason?:
    | ReasonRepost
    | {
        [k: string]: unknown;
        $type: string;
      };
}) {
  let text = "error";

  if ("text" in post.record && typeof post.record.text === "string") {
    text = post.record.text;
  }

  const avatar = post.author.avatar;

  const parent = reply?.parent ?? {};
  const parentAuthor =
    "author" in parent ? (parent.author as ProfileViewBasic) : null;

  const createdAt =
    "createdAt" in post.record && typeof post.record.createdAt === "string"
      ? post.record.createdAt
      : undefined;

  const images = parseImages(post.embed?.images);

  const reasonRepost = parseReasonRepost(reason);

  const id = post.uri.split("/").pop();

  const initials = (post.author.displayName ?? post.author.handle)
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="py-4 px-4 md:px-2 space-y-2 relative hover:bg-accent/30">
      {reasonRepost && (
        <span className="text-sm ml-8 -mb-1 flex items-center">
          <Repost className="text-lg mr-0.5" /> Reposted by{" "}
          {reasonRepost.by.displayName}
        </span>
      )}
      {/* Byline */}
      <div className="flex flex-row space-x-2 items-center text-sm">
        <Avatar className="h-6 w-6">
          <AvatarImage src={avatar} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <Link href={routes.user(post.author.handle)}>{post.author.handle}</Link>
        {/* {createdAt && <span className="text-muted-foreground text-xs">{dayjs(createdAt).format("MMM D")}</span>} */}
        {createdAt && <RelativeTime time={createdAt} />}
      </div>
      <div className="pl-8 space-y-3">
        {reply && parentAuthor && (
          <div className="-mt-3 mb-3 text-sm">
            <span className="text-muted-foreground">
              replied to
              <Link href={routes.user(parentAuthor?.handle)}>
                {parentAuthor?.handle}
              </Link>
            </span>
          </div>
        )}
        <p>{text}</p>

        {images && <Images images={images} />}

        <div className="flex flex-row items-center space-x-6 text-sm">
          <LikeButton
            cid={post.cid}
            uri={post.uri}
            like={post.viewer?.like}
            likeCount={post.likeCount}
          />
          <Link
            href={`/users/${post.author.handle}/posts/${id}`}
            className="flex items-center space-x-1"
          >
            <ReplyOutlined />
            {post.replyCount !== undefined && (
              <div>{abbriviateNumber(post.replyCount)}</div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
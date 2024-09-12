import { ReplyRef } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { ProfileViewBasic } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import * as routes from "@/lib/routes";
import { RelativeTime } from "./relative-time.client";
import { cn } from "@/lib/utils";
import { abbriviateNumber } from "@/lib/format";
import {
  postSchema,
  embedPostSchema,
  externalEmbed,
  postImageEmbedView,
} from "@/lib/schemas";
import { Repost, ReplyOutlined } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { LikeButton } from "./post-like-button.client";
import { AutoLinkText } from "./auto-link-text";
import { getInitials } from "@/lib/format";
import { TrackScroll } from "./track-scroll";
import { ActorHoverCard } from "./actor-hover-card";
import z from "zod";
import { isLabledSexual } from "@/lib/bsky/utils";
import { DismissableBlur } from "@/components/dismissable-blur";
import { VideoPlayer } from "./video-player";

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

function parseReasonRepost(reason: { [k: string]: unknown } | undefined) {
  try {
    return reasonRepost.parse(reason);
  } catch (e) {
    return null;
  }
}

function EmbededPost({ post }: { post: z.infer<typeof embedPostSchema> }) {
  const avatar = post.author.avatar;
  const initials = getInitials(post.author.displayName ?? post.author.handle);
  const createdAt = post.value.createdAt;

  const id = post.uri.split("/").pop();

  return (
    <div className="border p-3 rounded-md flex flex-col space-y-2 bg-card">
      <div className="flex flex-row space-x-2 items-center text-sm">
        <Avatar className="h-6 w-6">
          <AvatarImage src={avatar} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <ActorHoverCard actor={post.author}>
          <Link href={routes.user(post.author.handle)}>
            {post.author.handle}
          </Link>
        </ActorHoverCard>
        {createdAt && <RelativeTime time={createdAt} />}
      </div>
      <Link href={`/users/${post.author.handle}/posts/${id}`}>
        <p className="whitespace-pre-line text-sm overflow-hidden text-ellipsis">
          {/* TODO: handle facets */}
          {post.value.text}
        </p>
      </Link>

      {post.embeds?.map((embed) => {
        switch (embed.$type) {
          case "app.bsky.embed.external#view":
            return (
              <EmbedExternal
                external={embed.external}
                key={embed.external.uri}
              />
            );
          case "app.bsky.embed.images#view":
            return (
              <Images images={embed.images} key={embed.images[0].fullsize} />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function Images({
  images,
}: {
  images: z.infer<typeof postImageEmbedView>["images"];
}) {
  if (images.length === 1) {
    const [img] = images;
    const aspectRatio = img.aspectRatio
      ? img.aspectRatio.width / img.aspectRatio.height
      : 2 / 1;
    return (
      <div
        className="relative"
        style={{
          aspectRatio,
        }}
      >
        <Image
          unoptimized
          src={images[0].fullsize}
          alt={images[0].alt}
          fill
          className="rounded-lg object-cover"
        />
      </div>
    );
  }

  if (images.length == 2) {
    return (
      <div className="grid grid-cols-2 gap-px">
        {images.slice(0, 4).map((image, i) => (
          <div key={i} className="relative aspect-[1/1]">
            <Image
              unoptimized
              src={image.fullsize}
              alt={image.alt}
              fill
              className={cn(
                "object-cover",
                i === 0 && "rounded-l-md",
                i === 1 && "rounded-r-md",
              )}
            />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-3 grid-rows-2 gap-px">
        {images.map((image, i) => (
          <div
            key={i}
            className={cn(
              "relative aspect-[1/1]",
              i === 0 ? "col-span-2 row-span-2" : "col-span-1",
            )}
          >
            <Image
              unoptimized
              src={image.fullsize}
              alt={image.alt}
              fill
              className={cn(
                "object-cover",
                i === 0 && "rounded-l-md",
                i === 1 && "rounded-tr-md",
                i === 2 && "rounded-br-md",
              )}
            />
          </div>
        ))}
      </div>
    );
  }

  if (images.length >= 4) {
    return (
      <div className="grid grid-cols-2 gap-px">
        {images.slice(0, 4).map((image, i) => (
          <div key={i} className="relative aspect-[1/1]">
            <Image
              unoptimized
              src={image.fullsize}
              alt={image.alt}
              fill
              className={cn(
                " object-cover",
                i === 0 && "rounded-tl-md",
                i === 1 && "rounded-tr-md",
                i === 2 && "rounded-bl-md",
                i === 3 && "rounded-br-md",
              )}
            />
          </div>
        ))}
      </div>
    );
  }
}

// See: https://atproto.blue/en/latest/atproto/atproto_client.models.app.bsky.richtext.facet.html
const textEncoder = new TextEncoder();
const decoder = new TextDecoder();

function getPostBody(post: z.infer<typeof postSchema>) {
  let recordText = "error";

  if ("text" in post.record && typeof post.record.text === "string") {
    recordText = post.record.text;
  }

  const text: React.ReactNode[] = [];

  if (post.record.facets) {
    const byteArray = textEncoder.encode(recordText);

    const facetsSorted = post.record.facets.sort(
      (a, b) => a.index.byteStart - b.index.byteStart,
    );
    let i = 0;

    text.push(
      decoder.decode(byteArray.slice(0, facetsSorted[0]?.index.byteStart)),
    );

    for (const facet of facetsSorted) {
      const url = facet.features?.[0]?.uri;
      const facetText = decoder.decode(
        byteArray.slice(facet.index.byteStart, facet.index.byteEnd),
      );

      if (url) {
        text.push(
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-highlight hover:underline"
          >
            {facetText}
          </a>,
        );
      } else {
        text.push(facetText);
      }

      i = facet.index.byteEnd;
    }

    text.push(decoder.decode(byteArray.slice(i)));
  } else {
    text.push(recordText);
  }

  return text.map((t, i) => {
    if (typeof t === "string") {
      return <AutoLinkText key={i}>{t}</AutoLinkText>;
    }
    return t;
  });
}

function EmbedExternal({
  external,
}: {
  external: z.infer<typeof externalEmbed>;
}) {
  if (!external) {
    return null;
  }
  return (
    <a href={external.uri} target="_blank" rel="noopener noreferrer">
      <div className="aspect-video relative">
        <Image
          unoptimized
          src={external.thumb}
          alt={external.title}
          fill
          className="rounded-t-md object-cover"
        />
      </div>
      <div className="rounded-b-md border-x border-b py-2 px-3 space-y-0.5">
        <span className="font-bold">{external.title}</span>
        <p className="line-clamp-2 text-sm">{external.description}</p>
      </div>
    </a>
  );
}

export function Post({
  post,
  reply,
  reason,
}: {
  post: z.infer<typeof postSchema>;
  reply?: ReplyRef;
  reason?: {
    [k: string]: unknown;
  };
}) {
  const avatar = post.author.avatar;

  const parent = reply?.parent ?? {};
  const parentAuthor =
    "author" in parent ? (parent.author as ProfileViewBasic) : null;

  const createdAt =
    "createdAt" in post.record && typeof post.record.createdAt === "string"
      ? post.record.createdAt
      : undefined;

  const reasonRepost = parseReasonRepost(reason);

  const id = post.uri.split("/").pop();

  const initials = getInitials(post.author.displayName ?? post.author.handle);

  return (
    <TrackScroll id={createdAt}>
      <div className="py-4 px-4 lg:px-2 space-y-2 relative hover:bg-accent/30 border-b">
        {reasonRepost && (
          <span className="text-sm ml-8 -mb-1 flex items-center">
            <Repost className="text-lg mr-0.5" /> Reposted by{" "}
            {reasonRepost.by.displayName}
          </span>
        )}
        {/* Byline */}
        <div className="flex flex-row space-x-2 items-center text-sm">
          <ActorHoverCard actor={post.author}>
            <Link
              href={routes.user(post.author.handle)}
              className="flex flex-row space-x-2 items-center"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={avatar} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span>{post.author.handle}</span>
            </Link>
          </ActorHoverCard>
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

          <p className="whitespace-pre-line overflow-hidden text-ellipsis">
            {getPostBody(post)}
          </p>

          {post.embed.$type === "app.bsky.embed.record#view" && (
            <EmbededPost post={post.embed.record} />
          )}

          {post.embed.$type === "app.bsky.embed.external#view" && (
            <EmbedExternal external={post.embed.external} />
          )}

          {post.embed.$type === "app.bsky.embed.video#view" && (
            <VideoPlayer video={post.embed} />
          )}

          <div className="relative">
            {post.embed.$type === "app.bsky.embed.images#view" && (
              <Images images={post.embed.images} />
            )}
            {isLabledSexual(post) && (
              <DismissableBlur className="absolute inset-0 rounded-md" />
            )}
          </div>

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
    </TrackScroll>
  );
}

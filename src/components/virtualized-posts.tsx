"use client";

import { Post } from "@/components/post";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { feedViewPostSchema } from "@/lib/schemas";
import z from "zod";
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

import type {
  GetResponse as GetPostResponse,
  QueryParams as GetPostsParams,
} from "@/app/api/posts/route";

function estimateSize(
  feedViewPost: z.infer<typeof feedViewPostSchema> | FeedViewPost,
) {
  const post = feedViewPost.post;

  let totalHeight = 0;

  // Byline height
  totalHeight += 24;

  // Margin above text
  totalHeight += 8;

  // Measure text of post
  const charsPerLine = 50;
  const lineHeight = 24;
  const text = "text" in post.record ? post.record.text : undefined;
  const lines = text ? Math.ceil(text.length / charsPerLine) : 0;
  totalHeight += lineHeight * lines;

  // Footer
  totalHeight += 20;

  // Card above below padding
  totalHeight += 16 * 2;

  return totalHeight;
}

export function VirtualizedPosts({
  defaultPosts,
  defaultCursor,
  actor,
  mode,
  feedUri,
}: {
  defaultPosts: z.infer<typeof feedViewPostSchema>[];
  defaultCursor?: string;
  actor?: string;
  mode?: GetPostsParams["mode"];
  feedUri?: string;
}) {
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    setFirstRender(false);
  }, []);

  const [cursor, setCursor] = useState(defaultCursor);
  const [feed, setFeed] = useState(defaultPosts);

  const parentRef = useRef<HTMLDivElement>(null);
  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: feed.length,
    estimateSize: (i) => estimateSize(feed[i]),
    overscan: 10,
    scrollMargin: parentOffsetRef.current,
  });

  const items = virtualizer.getVirtualItems();

  const virtualizedItems = virtualizer.getVirtualItems();

  const [loadingMore, setLoadingMore] = useState(true);
  const atLastItem =
    virtualizedItems[virtualizedItems.length - 1]?.index === feed.length - 1;

  if (atLastItem && !loadingMore) {
    setLoadingMore(true);
  }

  useEffect(() => {
    if (loadingMore && cursor && (actor || feedUri) && mode) {
      let locked = false;
      const abortController = new AbortController();

      const urlParmas = new URLSearchParams();
      if (actor) {
        urlParmas.set("userId", actor);
      }
      urlParmas.set("mode", mode);
      urlParmas.set("cursor", cursor);
      if (feedUri) {
        urlParmas.set("feedUri", feedUri);
      }

      try {
        fetch(`/api/posts?${urlParmas.toString()}`, {
          signal: abortController.signal,
        })
          .then((res) => res.json())
          .then((data: GetPostResponse) => {
            if (!locked && !("errors" in data)) {
              setCursor(data.feed.length > 0 ? data.cursor : undefined);
              setFeed((prevFeed) => [...prevFeed, ...data.feed]);
              setLoadingMore(false);
            }
          });
      } catch (e) {
        setLoadingMore(false);
      }

      return () => {
        locked = true;
        abortController.abort("component unmounted, or changed request");
      };
    }
  }, [loadingMore, cursor, actor, mode, feedUri]);

  const translateY = (items[0]?.start ?? 0) - parentOffsetRef.current;

  return (
    <div
      ref={parentRef}
      className="relative"
      style={{
        height: firstRender ? 0 : virtualizer.getTotalSize(),
      }}
    >
      <div
        className="absolute w-full top-0 left-0"
        style={{
          transform: `translateY(${translateY ?? 0}px)`,
        }}
      >
        {items.map((virtualRow) => (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
          >
            <Post
              post={feed[virtualRow.index].post}
              reason={feed[virtualRow.index].reason}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

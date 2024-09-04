"use client";

import { Post } from "@/components/post";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { feedViewPostSchema } from "@/lib/schemas";
import z from "zod";
import {
  FeedViewPost,
  PostView,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";

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
  loadMoreEndpoint,
}: {
  defaultPosts: z.infer<typeof feedViewPostSchema>[] | FeedViewPost[];
  defaultCursor?: string;
  loadMoreEndpoint?: string;
}) {
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

  const [loadingMore, setLoadingMore] = useState(false);
  const atLastItem =
    virtualizedItems[virtualizedItems.length - 1]?.index === feed.length - 1;

  if (atLastItem && !loadingMore) {
    setLoadingMore(true);
  }

  useEffect(() => {
    if (loadingMore && loadMoreEndpoint) {
      let locked = false;
      const abortController = new AbortController();

      try {
        fetch(`${loadMoreEndpoint}?cursor=${cursor}`, {
          signal: abortController.signal,
        })
          .then((res) => res.json())
          .then(
            (data: {
              cursor: string;
              feed: z.infer<typeof feedViewPostSchema>[];
            }) => {
              if (!locked) {
                setCursor(data.cursor);
                setFeed((prevFeed) => [...prevFeed, ...(data.feed as any)]);
                setLoadingMore(false);
              }
            },
          );
      } catch (e) {
        setLoadingMore(false);
      }

      return () => {
        locked = true;
        abortController.abort();
      };
    }
  }, [loadingMore, loadMoreEndpoint, cursor]);

  return (
    <div
      ref={parentRef}
      className="relative"
      style={{
        height: virtualizer.getTotalSize(),
      }}
    >
      <div
        className="absolute w-full top-0 left-0"
        style={{
          transform: `translateY(${items[0]?.start - parentOffsetRef.current ?? 0}px)`,
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

"use client";

import { Post } from "@/components/post.server";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { postSchema } from "@/lib/schemas";
import z from "zod";
import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

function estimateSize(post: z.infer<typeof postSchema> | PostView) {
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
}: {
  defaultPosts: z.infer<typeof postSchema>[] | PostView[];
}) {
  const [posts, setPosts] = useState(defaultPosts);

  const parentRef = useRef<HTMLDivElement>(null);
  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: posts.length,
    estimateSize: (i) => estimateSize(posts[i]),
    overscan: 10,
    scrollMargin: parentOffsetRef.current,
  });

  const items = virtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >=
      posts.length - 1
      // hasNextPage &&
      // !isFetchingNextPage
    ) {
    }
  }, [posts.length, virtualizer.getVirtualItems()]);

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
            <Post post={posts[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}

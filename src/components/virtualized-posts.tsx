"use client";

import { Post } from '@/components/post.server'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { postSchema } from '@/lib/schemas'
import z from 'zod'
import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs';

export function VirtualizedPosts({ 
  defaultPosts, 
}: { 
  defaultPosts: z.infer<typeof postSchema>[] | PostView[], 
}) {
  const [posts, setPosts] = useState(defaultPosts);

  const parentRef = useRef<HTMLDivElement>(null)
  const parentOffsetRef = useRef(0)

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0
  }, [])

  const virtualizer = useWindowVirtualizer({
    count: posts.length,
    estimateSize: () => 100,
    // overscan: 10,
    overscan: 0,
    scrollMargin: parentOffsetRef.current,
  })

  const items = virtualizer.getVirtualItems()

  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse()

    if (!lastItem) {
      return
    }

    if (
      lastItem.index >= posts.length - 1
      // hasNextPage &&
      // !isFetchingNextPage
    ) {
      console.log("load more")
      // fetchNextPage()
    }
  }, [
    posts.length,
    virtualizer.getVirtualItems(),
  ])

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
  )
}

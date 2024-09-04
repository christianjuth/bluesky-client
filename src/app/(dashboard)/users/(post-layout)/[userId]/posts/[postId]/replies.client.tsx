"use client";

import { Post } from '@/components/post.server'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react';

import { repliesSchema } from '@/lib/schemas'
import z from 'zod'

export function Replies({ replies, children }: { replies: z.infer<typeof repliesSchema>, children: React.ReactNode }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: replies.length + 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 10,
  })

  const items = virtualizer.getVirtualItems()

  return (
    <div className="h-[100svh] -mt-14 pt-14">
      <div
        ref={parentRef}
        className="h-full overflow-y-auto"
      >
        <div
          className="relative"
          style={{
            height: virtualizer.getTotalSize(),
          }}
        >
          <div
            className="absolute w-full top-0 left-0"
            style={{
              transform: `translateY(${items[0]?.start ?? 0}px)`,
            }}
          >
            {items.map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
              >
                {virtualRow.index === 0 ? (
                  children
                ) : (
                  <Post post={replies[virtualRow.index - 1].post} />
                )}
              </div>
            ))}
          </div>
        </div>
        </div>
    </div>
  )
}

"use client"

import { Button } from '@/components/ui/button'
import Link from "next/link"
import { usePathname } from "next/navigation";
import * as routes from "@/lib/routes"

import { HomeOutlined, PersonOutlined } from "@/components/icons"

const getSidebarLinks = (userId?: string) => [
  {
    href: routes.home,
    text: "Home",
    icon: HomeOutlined
  },
  ...(userId ? [
    {
      href: routes.user(userId),
      text: "Profile",
      icon: PersonOutlined
    },
  ] : [
    {
      href: routes.auth,
      text: "Login",
      icon: PersonOutlined
    }
  ])
]

const matchPaths = (target: string, current: string) => {
  if (target === routes.home) {
    return current === target
  }

  return current.indexOf(target) === 0
}

export function Sidebar({
  userId
}: {
  userId?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      {getSidebarLinks(userId).map(({ href, text, icon: Icon }) => (
        <Button 
          key={href}
          asChild
          variant={matchPaths(href, pathname) ? "default" : "ghost"}
          className="justify-start"
        >
          <Link href={href}>
            <Icon className="mr-1.5 text-lg" />
            {text}
          </Link>
        </Button>
      ))}
    </div>
  )
}

"use client"

import { Button } from '@/components/ui/button'
import Link from "next/link"
import { usePathname } from "next/navigation";

const getSidebarLinks = (userDid: string) => [
  {
    href: "/",
    text: "Home",
  },
  {
    href: `/profile/${userDid}`,
    text: "Profile",
  },
]
  

export function Sidebar({
  userDid
}: {
  userDid: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      {getSidebarLinks(userDid).map(({ href, text }) => (
        <Button 
          key={href}
          asChild
          variant={pathname === href ? "default" : "ghost"}
          className="justify-start"
        >
          <Link
            href={href}
          >
            {text}
          </Link>
        </Button>
      ))}
    </div>
  )
}

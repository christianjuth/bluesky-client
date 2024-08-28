import { Button } from '@/components/ui/button'
import Link from 'next/link'

const links = [
  {
    page: "",
    label: "Overview",
  },
  {
    page: 'posts',
    label: 'Posts',
  },
  {
    page: 'likes',
    label: 'Likes',
  },
] as const

export function ProfileNavbar({
  activeLink,
}: {
  activeLink: (typeof links[number])['page']
}) {
  return (
    <div className="mb-3 flex flex-row space-x-2">
      {links.map((link) => (
        <Button key={link.page} asChild variant={link.page === activeLink ? "default" : "outline"}>
          <Link href={`/profile/${link.page}`}>
            {link.label}
          </Link>
        </Button>
      ))}
    </div>
  ) 
}

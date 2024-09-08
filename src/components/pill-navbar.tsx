"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Link = {
  href: string;
  label: string;
};

export function PillNavbar({ links }: { links: Link[] }) {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-3 flex flex-row space-x-2">
        {links.map((link) => {
          return (
            <Button
              key={link.href}
              asChild
              variant={link.href === pathname ? "default" : "outline"}
              size="sm"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          );
        })}
      </div>
    </>
  );
}

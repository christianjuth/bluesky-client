"use client";

import { Input } from "@/components/ui/input";
import * as routes from "@/lib/routes";
import { usePathname } from "next/navigation";

export function SearchBar() {
  const pathname = usePathname().split("/");

  let defaultValue = "";

  if (pathname[1] === "search" && Boolean(pathname[2])) {
    defaultValue = decodeURIComponent(pathname[2]);
  }

  return (
    <form method="GET" action={routes.search}>
      <Input
        name="q"
        className="w-60"
        placeholder="Search..."
        defaultValue={defaultValue}
      />
    </form>
  );
}

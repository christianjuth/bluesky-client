"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <h1>Coming soon...</h1>
      <button onClick={() => router.refresh()}>Revalidate</button>
    </div>
  );
}

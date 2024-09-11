"use server";

import { logout as deleteAuthCookies } from "@/lib/bsky/agent";

export async function logout() {
  deleteAuthCookies();
}

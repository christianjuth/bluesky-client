"use server";

import { logout as deleteAuthCookies } from "@/lib/atp-client";

export async function logout() {
  deleteAuthCookies();
}

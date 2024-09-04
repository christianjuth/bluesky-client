import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function containsUnicode(str: string) {
  return /[^\u0000-\u007F]/.test(str);
}

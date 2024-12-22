import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export type idParams = {
  params: Promise<{ id: string }>
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

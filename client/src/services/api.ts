import { API_URL } from "@/lib/constants";
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.message ?? "Request failed");
  return res.json() as Promise<T>;
}

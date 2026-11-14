import { API_URL } from "@/lib/constants";

export async function api<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || `Request failed: ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}
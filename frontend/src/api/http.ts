const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn("VITE_API_BASE_URL is not set. Add it to frontend/.env");
}

type RequestOptions = {
  headers?: Record<string, string>;
};

function mergeHeaders(extra?: Record<string, string>) {
  return {
    "Content-Type": "application/json",
    ...(extra || {}),
  };
}

export async function apiGet<T>(path: string, options?: RequestOptions): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: mergeHeaders(options?.headers),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.message as string)) || `GET ${path} failed: ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  options?: RequestOptions
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: mergeHeaders(options?.headers),
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.message as string)) || `POST ${path} failed: ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

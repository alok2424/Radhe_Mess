// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// if (!API_BASE_URL) {
//   // eslint-disable-next-line no-console
//   console.warn("VITE_API_BASE_URL is not set. Add it to frontend/.env");
// }

// type RequestOptions = {
//   headers?: Record<string, string>;
// };

// function mergeHeaders(extra?: Record<string, string>) {
//   return {
//     "Content-Type": "application/json",
//     ...(extra || {}),
//   };
// }

// export async function apiGet<T>(path: string, options?: RequestOptions): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     method: "GET",
//     headers: mergeHeaders(options?.headers),
//   });

//   const data = await res.json().catch(() => null);

//   if (!res.ok) {
//     const message =
//       (data && (data.message as string)) || `GET ${path} failed: ${res.status}`;
//     throw new Error(message);
//   }

//   return data as T;
// }

// export async function apiPost<T>(
//   path: string,
//   body: unknown,
//   options?: RequestOptions
// ): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     method: "POST",
//     headers: mergeHeaders(options?.headers),
//     body: JSON.stringify(body),
//   });

//   const data = await res.json().catch(() => null);

//   if (!res.ok) {
//     const message =
//       (data && (data.message as string)) || `POST ${path} failed: ${res.status}`;
//     throw new Error(message);
//   }

//   return data as T;
// }
// export async function apiPut<T>(
//   path: string,
//   body: unknown,
//   options?: RequestOptions
// ): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     method: "PUT",
//     headers: mergeHeaders(options?.headers),
//     body: JSON.stringify(body),
//   });

//   const data = await res.json().catch(() => null);

//   if (!res.ok) {
//     const message =
//       (data && (data.message as string)) || `PUT ${path} failed: ${res.status}`;
//     throw new Error(message);
//   }

//   return data as T;
// }

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

async function parseJsonSafe(res: Response) {
  return await res.json().catch(() => null);
}

function buildError(method: string, path: string, res: Response, data: any) {
  return (
    (data && (data.message as string)) ||
    `${method} ${path} failed: ${res.status}`
  );
}

export async function apiGet<T>(path: string, options?: RequestOptions): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: mergeHeaders(options?.headers),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(buildError("GET", path, res, data));
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

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(buildError("POST", path, res, data));
  }

  return data as T;
}

export async function apiPut<T>(
  path: string,
  body: unknown,
  options?: RequestOptions
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: mergeHeaders(options?.headers),
    body: JSON.stringify(body),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(buildError("PUT", path, res, data));
  }

  return data as T;
}

// ✅ Optional (won't affect anything): useful for future admin actions
export async function apiDelete<T>(
  path: string,
  options?: RequestOptions
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: mergeHeaders(options?.headers),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(buildError("DELETE", path, res, data));
  }

  return data as T;
}

const DEFAULT_API_BASE = 'http://localhost:3000';

function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (configured ?? DEFAULT_API_BASE).replace(/\/+$/, '');
}

function buildUrl(path: string): string {
  return `${getApiBaseUrl()}${path}`;
}

export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path));
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

export async function postJson<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

export async function putJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let details = '';
    try {
      const errorBody = (await response.json()) as { error?: string; details?: string };
      details = errorBody.details ?? errorBody.error ?? '';
    } catch {
      details = '';
    }
    throw new Error(details || `Request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

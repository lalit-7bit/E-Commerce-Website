const viteApiBaseUrl =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL
    ? String(import.meta.env.VITE_API_BASE_URL)
    : "";

const nextApiBaseUrl =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : "";

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

export function getApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const configuredBaseUrl = viteApiBaseUrl || nextApiBaseUrl;

  if (!configuredBaseUrl) {
    return normalizedPath;
  }

  return `${normalizeBaseUrl(configuredBaseUrl)}${normalizedPath}`;
}

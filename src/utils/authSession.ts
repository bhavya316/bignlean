export const AUTH_STORAGE_KEY = "AUTH";
export const AUTH_TOKEN_STORAGE_KEY = "AUTH_TOKEN";

export function getAuthToken() {
  if (typeof window === "undefined") return null;

  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) return token;

  const rawAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawAuth || rawAuth === "null") return null;

  try {
    const auth = JSON.parse(rawAuth);
    return auth?.token || null;
  } catch {
    return null;
  }
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function persistAuthSession(user: any, token?: string) {
  if (typeof window === "undefined") return;

  const authPayload = token ? { ...user, token } : user;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload));

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

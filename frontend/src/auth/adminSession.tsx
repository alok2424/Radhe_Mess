const KEY = "RADHE_ADMIN_TOKEN";

export function setAdminToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function getAdminToken() {
  return localStorage.getItem(KEY);
}

export function clearAdminToken() {
  localStorage.removeItem(KEY);
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}

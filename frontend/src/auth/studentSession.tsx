const KEY = "RADHE_STUDENT_TOKEN";

export function setStudentToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function getStudentToken() {
  return localStorage.getItem(KEY);
}

export function clearStudentToken() {
  localStorage.removeItem(KEY);
}

export function isStudentLoggedIn() {
  return Boolean(getStudentToken());
}

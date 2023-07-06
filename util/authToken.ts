import jwtDecode from "jwt-decode";

const authToken: { token: string | null; exp: number } = {
  token: null,
  exp: -1,
};

export function getToken() {
  if (Date.now() >= authToken.exp * 1000) return null;

  return authToken.token;
}

export function setToken(token: string) {
  authToken.token = token;

  const decoded = jwtDecode<{ exp?: number }>(token);
  if (decoded == null || decoded.exp == null) {
    authToken.exp = Date.now() / 1000 + 60 * 60;
    return;
  }

  authToken.exp = decoded.exp;
}

export function clearToken() {
  authToken.token = null;
  authToken.exp = -1;
}

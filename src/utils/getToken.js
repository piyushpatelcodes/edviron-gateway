export function getTokenFromCookie(cookieName = 'token') {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) return value;
  }
  return null;
}

export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch (e) {
    console.log("🚀 ~ parseJwt ~ e:", e)
    return null;
  }
}

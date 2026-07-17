const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
};

const setCookie = (name, value, days = 7) => {
  const expires = days ? `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}` : '';
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=strict`;
};

const getCookie = (name) => {
  if (typeof document === "undefined") return "";
  return document.cookie.split(';').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0].trim() === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const storeTokens = (access, refresh) => {
  setCookie(TOKEN_KEYS.ACCESS, access, 1); // 1 day for access
  setCookie(TOKEN_KEYS.REFRESH, refresh, 7); // 7 days for refresh
};

export const getStoredTokens = () => ({
  access: getCookie(TOKEN_KEYS.ACCESS),
  refresh: getCookie(TOKEN_KEYS.REFRESH),
});

export const clearTokens = () => {
  deleteCookie(TOKEN_KEYS.ACCESS);
  deleteCookie(TOKEN_KEYS.REFRESH);
};

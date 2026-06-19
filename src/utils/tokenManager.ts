import { removeSecureToken } from './cryptoUtils';

// Save token to BOTH localStorage AND cookies
export const saveToken = (token: string, rememberMe: boolean = false) => {
  try {
    // Save to localStorage (for client-side access)
    localStorage.setItem('auth_token', token);
  } catch (e) {
    // Ignore error if localStorage is blocked
  }

  // Save to cookies (for middleware/server-side access)
  // Set expiry: 15 days if rememberMe is true, else 1 day for web,7 days for mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  let expiryDays;
  if (rememberMe) {
    expiryDays = 15;
  } else {
    expiryDays = isMobile ? 7 : 1;
  }
  
  const date = new Date();
  date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;

  document.cookie = `auth_token=${token};${expires};path=/;SameSite=Strict`;
};

// Get token from localStorage
export const getToken = (): string | null => {
  try {
    return localStorage.getItem('auth_token');
  } catch (e) {
    return null;
  }
};

// Clear token from BOTH localStorage AND cookies
export const clearToken = () => {
  try {
    // Remove from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
  } catch (e) {
    // Ignore error if localStorage is blocked
  }
  
  removeSecureToken();

  // Remove from cookies
  document.cookie = 'auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
};  
// Save token to BOTH localStorage AND cookies
export const saveToken = (token: string) => {
  try {
    // Save to localStorage (for client-side access)
    localStorage.setItem('auth_token', token);
  } catch (e) {
    // Ignore error if localStorage is blocked
  }

  // Save to cookies (for middleware/server-side access)
  // Set expiry: 7 days for app (mobile), 24 hours (1 day) for web (desktop)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const expiryDays = isMobile ? 7 : 1;
  
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
  } catch (e) {
    // Ignore error if localStorage is blocked
  }

  // Remove from cookies
  document.cookie = 'auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
};  
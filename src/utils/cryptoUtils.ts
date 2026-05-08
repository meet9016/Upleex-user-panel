export const setSecureToken = (token: string) => {
  if (typeof window !== 'undefined') {
    try {
      // Basic encode to hide it from plain sight in application tab
      const encoded = btoa(token).split('').reverse().join('');
      localStorage.setItem('token', encoded);
    } catch (e) {
      try {
        localStorage.setItem('token', token);
      } catch (err) {
        // Ignore error if localStorage is completely blocked
      }
    }
  }
};

export const getSecureToken = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const encoded = localStorage.getItem('token');
      if (!encoded) return null;
      const decoded = atob(encoded.split('').reverse().join(''));
      if (!decoded || typeof decoded !== 'string') return null;
      return decoded;
    } catch (e) {
      try {
        localStorage.removeItem('token');
      } catch { /* ignore */ }
      return null;
    }
  }
  return null;
};

export const removeSecureToken = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('token');
    } catch (e) {
      // Ignore error if localStorage is completely blocked
    }
  }
};

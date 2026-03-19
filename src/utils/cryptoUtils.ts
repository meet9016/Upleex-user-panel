export const setSecureToken = (token: string) => {
  if (typeof window !== 'undefined') {
    try {
      // Basic encode to hide it from plain sight in application tab
      const encoded = btoa(token).split('').reverse().join('');
      localStorage.setItem('token', encoded);
    } catch (e) {
      localStorage.setItem('token', token);
    }
  }
};

export const getSecureToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const encoded = localStorage.getItem('token');
    if (!encoded) return null;
    try {
      return atob(encoded.split('').reverse().join(''));
    } catch (e) {
      return encoded; // fallback in case it was stored raw
    }
  }
  return null;
};

export const removeSecureToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

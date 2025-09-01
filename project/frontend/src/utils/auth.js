export const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    // Convert from base64url to base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  try {
    const user = decodeJWT(token);
    if (!user || !user.exp) return true;

    return user.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

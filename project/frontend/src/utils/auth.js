export const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    
    // Decode base64
    const decoded = atob(payload);
    const user = JSON.parse(decoded);
    
    return user;

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
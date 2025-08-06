class TokenStorage {
  static TOKEN_KEY = "accessToken";
  static TOKEN_EXPIRATION_KEY = "tokenExpiry";

  static setToken(token) {
    try {
      if (!token) return false;
      const expiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.TOKEN_EXPIRATION_KEY, expiry.toString());
      return true;
    } catch (error) {
      return false;
    }
  }

  static getToken() {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const expiry = localStorage.getItem(this.TOKEN_EXPIRATION_KEY);
      const expiryTime = Number(expiry);

      if (!token || !expiryTime) return null;
      const currentTime = new Date().getTime();
      if (expiryTime < currentTime) {
        this.removeToken();
        return null;
      }

      return token;
    } catch (error) {
      return null;
    }
  }

  static removeToken() {
    try {
      localStorage.removeToken(this.TOKEN_KEY);
      localStorage.removeToken(this.TOKEN_EXPIRATION_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  static hasValidToken() {
    return this.getToken() !== null;
  }

  static clearAuthData() {
    try {
      const keyToRemove = [this.TOKEN_KEY, this.TOKEN_EXPIRATION_KEY];
      keyToRemove.forEach((key) => localStorage.removeItem(key));
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default TokenStorage;

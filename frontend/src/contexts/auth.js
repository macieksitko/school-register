import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import AuthService from "../api/auth.service"
import TokenService from "../api/token.service"

function AuthProvider(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const result = await TokenService.getUser();
      if (result?.access_token) {
        setUser(result);
      }

      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (email, password) => {
    const result = await AuthService.login(email, password);
    if (result?.access_token) {
      setUser(result);
    }

    return result;
  }, []);

  const signOut = useCallback(() => {
    TokenService.removeUser();
    setUser();
  }, []);

  return <AuthContext.Provider value={{ user, signIn, signOut, loading }} {...props} />;
}

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };

import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import AuthService from "../api/auth.service";
import TokenService from "../api/token.service";
import { getRoutesForRole } from "../utils/pages-routes";

function AuthProvider(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState();
  const [routes, setRoutes] = useState([]);

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
      const { role: r } = result.user;
      setRoutes(getRoutesForRole(r));
      setRole(r);
      setUser(result);
    }

    return result;
  }, []);

  const signOut = useCallback(() => {
    TokenService.removeUser();
    setUser(undefined);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading, role, routes }} {...props} />
  );
}

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };

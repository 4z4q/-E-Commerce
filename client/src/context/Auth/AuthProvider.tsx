import { AuthContext } from "./AuthContext";
import { FC, PropsWithChildren, useState } from "react";

const USER_NAME = "username";
const TOKEN = "token";

// This component is used to provide the AuthContext to the rest of the app
// FC = FunctionComponent Used to create a functional component
export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [username, setUserName] = useState<string | null>(
    localStorage.getItem(USER_NAME)
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(TOKEN)
  );

  const isAuthenticated = !!token; //  This is used to check if the user is authenticated and return true if token is not null

  // This function is used to login the user and set the username and token in the AuthContext
  const login = (username: string, token: string) => {
    setUserName(username);
    setToken(token);
    localStorage.setItem(USER_NAME, username);
    localStorage.setItem(TOKEN, token);
  };

  const logout = () => {
    localStorage.removeItem(USER_NAME);
    localStorage.removeItem(TOKEN);
    setUserName(null); // clear the name and token => without refresh
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ username, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useContext } from "react";

interface AuthContextType {
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  username: null,
  token: null,
  isAuthenticated: false,
  login: () => {}, // Default empty function
  logout: () => {},
});

// Access the AuthContext using the useAuth hook in your components
export const useAuth = () => useContext(AuthContext);

import { createContext, useContext } from "react";

export type AuthData = {
  userData: { id: string; name: string; email: string } | null;
  signIn: (data: { email: string; password: string }) => void | Promise<void>;
  signOut: () => void | Promise<void>;
  refreshToken: () => void | Promise<void>;
};

export const AuthContext = createContext<AuthData>({
  signIn: () => {},
  signOut: () => {},
  refreshToken: () => {},
  userData: null,
});

const useAuth = () => useContext(AuthContext);

export default useAuth;

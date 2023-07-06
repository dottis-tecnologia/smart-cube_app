import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "../hooks/useAuth";
import trpc from "../util/trpc";
import * as SecureStore from "expo-secure-store";
import usePersistentState from "../hooks/usePersistentState";
import { TRPCClientError } from "@trpc/client";
import { clearToken, setToken } from "../util/authToken";

export type AuthWrapperProps = {
  children?: ReactNode | ReactNode[];
};

type Payload = {
  token: string;
  user: { id: string; name: string; email: string };
  refreshToken: string;
};

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser, clearUser] = usePersistentState<{
    id: string;
    name: string;
    email: string;
  } | null>("user-data", null);

  const setAuth = async (payload: Payload) => {
    const { refreshToken, token, user: newUser } = payload;

    await SecureStore.setItemAsync("refresh-token", refreshToken);
    setToken(token);
  };

  const signOut = async () => {
    await clearUser();
    await SecureStore.deleteItemAsync("refresh-token");
    clearToken();
  };

  const refreshToken = async () => {
    const refreshToken = await SecureStore.getItemAsync("refresh-token");

    if (refreshToken == null) {
      await signOut();
      throw new Error("Refresh token is null");
    }

    try {
      const data = await trpc.session.refreshToken.query(refreshToken);
      await setAuth(data);
    } catch (e) {
      if (e instanceof TRPCClientError) {
        const message = e.message;

        if (message === "Invalid refresh token") {
          signOut();
          throw new Error("Refresh token is invalid");
        }
      }
      throw e;
    }
  };

  const signIn = async (data: { email: string; password: string }) => {
    const token = await trpc.session.login.mutate(data);

    await setAuth(token);
    setUser(token.user);
  };

  return (
    <AuthContext.Provider
      value={{ refreshToken, signIn, signOut, userData: user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import "./i18n";

import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import Root from "./screens/Root";
import { ThemeProvider } from "./components/ThemeProvider";
import AuthWrapper from "./components/AuthWrapper";
import { useCallback, useEffect, useState } from "react";
import { createTables } from "./util/db";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { StatusBar, StatusBarProps } from "expo-status-bar";
import { StatusBarContext } from "./hooks/useStatusBar";
import useAuth from "./hooks/useAuth";
import type { RootStackParamList } from "./screens/Root";

SplashScreen.preventAutoHideAsync();

type NavRef = ReturnType<typeof useNavigationContainerRef<RootStackParamList>>;

function AuthRedirect({ navRef }: { navRef: NavRef }) {
  const { userData, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!navRef.isReady()) return;
    if (userData) {
      navRef.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } else {
      navRef.reset({ index: 0, routes: [{ name: "Login" }] });
    }
  }, [userData, isLoading]);

  return null;
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [statusBarProps, setStatusBarProps] = useState<StatusBarProps>({
    style: "dark",
  });

  useEffect(() => {
    async function prepare() {
      try {
        await createTables();
        await Promise.all([
          Font.loadAsync(FontAwesome.font),
          Font.loadAsync(FontAwesome5.font),
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const statusBarContextValue = useCallback(
    (props: StatusBarProps) => setStatusBarProps(props),
    []
  );

  const navRef = useNavigationContainerRef<RootStackParamList>();

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <StatusBar {...statusBarProps} />
      <StatusBarContext.Provider
        value={{ setProps: statusBarContextValue }}
      >
        <ThemeProvider theme="light">
          <NavigationContainer ref={navRef}>
            <AuthWrapper>
              <AuthRedirect navRef={navRef} />
              <Root />
            </AuthWrapper>
          </NavigationContainer>
        </ThemeProvider>
      </StatusBarContext.Provider>
    </>
  );
}

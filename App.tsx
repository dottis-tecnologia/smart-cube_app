import "./i18n";

import { NavigationContainer } from "@react-navigation/native";
import Root from "./screens/Root";
import { ThemeProvider } from "./components/ThemeProvider";
import AuthWrapper from "./components/AuthWrapper";
import { useEffect, useState } from "react";
import { createTables } from "./util/db";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { StatusBar, StatusBarProps } from "expo-status-bar";
import { StatusBarContext } from "./hooks/useStatusBar";

SplashScreen.preventAutoHideAsync();

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

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <StatusBar {...statusBarProps} />
      <StatusBarContext.Provider
        value={{
          setProps(props) {
            setStatusBarProps(props);
          },
        }}
      >
        <ThemeProvider theme="light">
          <NavigationContainer>
            <AuthWrapper>
              <Root />
            </AuthWrapper>
          </NavigationContainer>
        </ThemeProvider>
      </StatusBarContext.Provider>
    </>
  );
}

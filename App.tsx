import { NavigationContainer } from "@react-navigation/native";
import Root from "./screens/Root";
import { NativeBaseProvider } from "native-base";
import { theme, themeConfig } from "./config";
import AuthWrapper from "./components/AuthWrapper";
import { useCallback, useEffect, useState } from "react";
import { createTables } from "./util/db";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

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

  const onReady = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <NativeBaseProvider theme={theme} config={themeConfig}>
        <NavigationContainer onReady={onReady}>
          <AuthWrapper>
            <Root />
          </AuthWrapper>
        </NavigationContainer>
      </NativeBaseProvider>
    </>
  );
}

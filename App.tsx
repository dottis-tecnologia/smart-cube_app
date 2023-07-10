import { NavigationContainer } from "@react-navigation/native";
import Root from "./screens/Root";
import { NativeBaseProvider } from "native-base";
import { theme, themeConfig } from "./config";
import AuthWrapper from "./components/AuthWrapper";
import { useEffect } from "react";
import { createTables } from "./util/db";

export default function App() {
  useEffect(() => {
    createTables();
  }, []);

  return (
    <>
      <NativeBaseProvider theme={theme} config={themeConfig}>
        <NavigationContainer>
          <AuthWrapper>
            <Root />
          </AuthWrapper>
        </NavigationContainer>
      </NativeBaseProvider>
    </>
  );
}

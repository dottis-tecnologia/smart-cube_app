import { NavigationContainer } from "@react-navigation/native";
import Root from "./screens/Root";
import { NativeBaseProvider } from "native-base";
import { theme, themeConfig } from "./config";
import AuthWrapper from "./components/AuthWrapper";

export default function App() {
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

import { NavigationContainer } from "@react-navigation/native";
import Root from "./screens/Root";
import { NativeBaseProvider } from "native-base";
import { theme, themeConfig } from "./config";

export default function App() {
  return (
    <>
      <NativeBaseProvider theme={theme} config={themeConfig}>
        <NavigationContainer>
          <Root />
        </NavigationContainer>
      </NativeBaseProvider>
    </>
  );
}

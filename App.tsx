import { NavigationContainer } from "@react-navigation/native";
import Root from "./screens/Root";
import {
  INativebaseConfig,
  NativeBaseProvider,
  extendTheme,
} from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import trpc from "./util/trpc";

// extend the theme
const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "light",
  },
  components: {
    Button: {
      baseStyle: {
        rounded: "lg",
      },

      defaultProps: {
        px: 8,
      },
    },
    Input: {
      baseStyle: {
        rounded: "lg",
      },
    },
  },
  colors: {
    primary: {
      "50": "#8bd4ff",
      "100": "#63c6ff",
      "200": "#3bb7ff",
      "300": "#13a9ff",
      "400": "#0093e9",
      "500": "#0684cd",
      "600": "#0b74b0",
      "700": "#0f6495",
      "800": "#11547c",
      "900": "#124563",
    },
    secondary: {
      "50": "#aeeff5",
      "100": "#8ee5ed",
      "200": "#71d9e3",
      "300": "#56cbd6",
      "400": "#36c2cf",
      "500": "#35acb7",
      "600": "#36969f",
      "700": "#368187",
      "800": "#346d72",
      "900": "#315a5d",
    },
    emphasis: {
      "50": "#d1f793",
      "100": "#c0ef73",
      "200": "#aee655",
      "300": "#9cd939",
      "400": "#88c425",
      "500": "#79ab28",
      "600": "#6a9229",
      "700": "#5c7b29",
      "800": "#4d6527",
      "900": "#405124",
    },
  },
});
const config: INativebaseConfig = {
  dependencies: {
    "linear-gradient": LinearGradient,
  },
};

export default function App() {
  return (
    <>
      <NativeBaseProvider theme={theme} config={config}>
        <NavigationContainer>
          <Root />
        </NavigationContainer>
      </NativeBaseProvider>
    </>
  );
}

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs/Tabs";
import HeaderBar from "../components/shared/HeaderBar";
import Meter from "./Meter";
import CreateReading from "./CreateReading";
import Reading from "./Reading";
import Login from "./NoAuth/Login";
import ListMeters from "./ListMeters";
import { useTranslation } from "react-i18next";

export type RootProps = {};

export type RootStackParamList = {
  Tabs: undefined;
  Meter: { id: string };
  Reading: { id: string };
  CreateReading: { meterId: string };
  ListMeters: { location: string };
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Root({}: RootProps) {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        header: HeaderBar,
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Meter"
        component={Meter}
        options={{ title: t("titles.meter") }}
      />
      <Stack.Screen
        name="ListMeters"
        component={ListMeters}
        options={{ title: t("titles.meters") }}
      />
      <Stack.Screen name="Reading" component={Reading} />
      <Stack.Screen
        name="CreateReading"
        component={CreateReading}
        options={{ title: t("titles.reading") }}
      />
    </Stack.Navigator>
  );
}

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs/Tabs";
import HeaderBar from "../components/shared/HeaderBar";
import Meter from "./Meter";
import CreateReading from "./CreateReading";
import { useEffect } from "react";
import { deleteDatabase, getDatabase } from "../util/db";
import Reading from "./Reading";
import Login from "./NoAuth/Login";
import useAuth from "../hooks/useAuth";
import { Center, Spinner } from "native-base";

export type RootProps = {};

export type RootStackParamList = {
  Tabs: undefined;
  Meter: { id: string };
  Reading: { id: string };
  CreateReading: { meterId: string };
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Root({}: RootProps) {
  const { userData } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        header: HeaderBar,
      }}
    >
      {userData ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Meter" component={Meter} />
          <Stack.Screen name="Reading" component={Reading} />
          <Stack.Screen name="CreateReading" component={CreateReading} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

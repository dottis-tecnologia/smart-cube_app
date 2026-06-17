import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ReadCode from "./ReadCode";
import Home from "./Home";
import TabBar from "../../components/shared/TabBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Root";
import Sync from "./Sync";
import Locations from "./Locations";
import Search from "./Search";
import { useTranslation } from "react-i18next";

export type TabParamList = {
  Home: undefined;
  Locations: { filter?: string } | undefined;
  ReadCode: undefined;
  Search: { filter?: string } | undefined;
  Sync: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export type TabsProps = NativeStackScreenProps<RootStackParamList>;

export default function Tabs({}: TabsProps) {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={TabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: t("tabs.home"),
          headerShown: false,
          tabBarIcon: tabBarIcon("home", "home-outline"),
        }}
      />
      <Tab.Screen
        name="Locations"
        component={Locations}
        options={{
          tabBarIcon: tabBarIcon("map-marker", "map-marker-outline"),
          title: t("tabs.locations"),
        }}
      />
      <Tab.Screen
        name="ReadCode"
        component={ReadCode}
        options={{
          tabBarIcon: tabBarIcon("qrcode-scan", "qrcode-scan"),
          title: t("tabs.read"),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: tabBarIcon("magnify", "magnify"),
          title: t("tabs.search"),
        }}
      />
      <Tab.Screen
        name="Sync"
        component={Sync}
        options={{
          tabBarIcon: tabBarIcon("cloud-sync", "cloud-sync-outline"),
          title: t("tabs.sync"),
        }}
      />
    </Tab.Navigator>
  );
}

const tabBarIcon =
  (activeName: string, inactiveName: string) =>
  ({ color, size, focused }: { color: string; size: number; focused: boolean }) =>
    (
      <MaterialCommunityIcons
        name={(focused ? activeName : inactiveName) as any}
        color={color}
        size={size}
      />
    );

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ReadCode from "./ReadCode";
import Home from "./Home";
import TabBar from "../../components/shared/TabBar";
import { Icon } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import HeaderBar from "../../components/shared/TabHeaderBar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Root";
import Sync from "./Sync";
import Locations from "./Locations";
import Search from "./Search";
import type { InterfaceIconProps } from "native-base/lib/typescript/components/primitives/Icon/types";
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
        header: HeaderBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: t("tabs.home", "Home"),
          headerShown: false,
          tabBarIcon: tabBarIcon("home"),
        }}
      />
      <Tab.Screen
        name="Locations"
        component={Locations}
        options={{
          tabBarIcon: tabBarIcon("list"),
          title: t("tabs.locations", "Locations"),
        }}
      />
      <Tab.Screen
        name="ReadCode"
        component={ReadCode}
        options={{
          tabBarIcon: tabBarIcon("qrcode", { marginLeft: 1 }),
          title: t("tabs.read", "Read"),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: tabBarIcon("search"),
          title: t("tabs.search", "Search"),
        }}
      />
      <Tab.Screen
        name="Sync"
        component={Sync}
        options={{
          tabBarIcon: tabBarIcon("refresh"),
          title: t("tabs.sync", "Sync"),
        }}
      />
    </Tab.Navigator>
  );
}

const tabBarIcon =
  (name: string, options?: InterfaceIconProps) =>
  ({ color, size }: { color: string; size: number }) =>
    (
      <Icon
        as={FontAwesome}
        name={name}
        color={color}
        size={size}
        {...options}
      />
    );

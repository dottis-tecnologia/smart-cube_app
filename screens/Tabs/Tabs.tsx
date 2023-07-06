import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ReadCode from "./ReadCode";
import Home from "./Home";
import TabBar from "../../components/shared/TabBar";
import { Icon } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import HeaderBar from "../../components/shared/TabHeaderBar";
import FocusAwareStatusBar from "../../components/util/FocusAwareStatusBar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Root";
import Sync from "./Sync";
import Locations from "./Locations";
import Search from "./Search";

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
          headerShown: false,
          tabBarIcon: tabBarIcon("home"),
        }}
      />
      <Tab.Screen
        name="Locations"
        component={Locations}
        options={{
          tabBarIcon: tabBarIcon("list"),
          tabBarLabel: "Locations",
          title: "Locations",
        }}
      />
      <Tab.Screen
        name="ReadCode"
        component={ReadCode}
        options={{
          tabBarIcon: tabBarIcon("qrcode"),
          tabBarLabel: "Read",
          title: "Read QR Code",
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: tabBarIcon("search"),
          tabBarLabel: "Search",
          title: "Find Meter",
        }}
      />
      <Tab.Screen
        name="Sync"
        component={Sync}
        options={{
          tabBarIcon: tabBarIcon("refresh"),
          tabBarLabel: "Sync",
        }}
      />
    </Tab.Navigator>
  );
}

const tabBarIcon =
  (name: string) =>
  ({ color, size }: { color: string; size: number }) =>
    <Icon as={FontAwesome} name={name} color={color} size={size} />;

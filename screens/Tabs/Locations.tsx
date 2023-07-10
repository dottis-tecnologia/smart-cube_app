import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { TabParamList } from "./Tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Root";
import FocusAwareStatusBar from "../../components/util/FocusAwareStatusBar";
import {
  Box,
  Center,
  FlatList,
  Text,
  Heading,
  HStack,
  Icon,
  VStack,
  Pressable,
  Input,
  ScrollView,
} from "native-base";
import useQuery from "../../hooks/useQuery";
import { dbQuery } from "../../util/db";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";

export type LocationsProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Locations">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function Locations({ navigation, route }: LocationsProps) {
  const filter = route.params?.filter || "";
  const { data } = useQuery(
    () =>
      dbQuery<{ location: string; meterCount: number }>(
        "SELECT count(id) as meterCount, location FROM meters WHERE UPPER(location) LIKE UPPER(?) GROUP BY location",
        [`%${filter}%`] // Implement filtering here
      ),
    [filter]
  );

  return (
    <Box bg="light.100" flex={1}>
      <FocusAwareStatusBar style="dark" />
      <ScrollView flex={1}>
        <Center
          bg={{
            linearGradient: {
              colors: ["primary.400", "secondary.400"],
              start: [0, 0],
              end: [0, 1],
            },
          }}
          p={8}
          pb={10}
        >
          <Box w="full" key="1">
            <Heading color="white" mb={3}>
              LOCATION
            </Heading>
          </Box>
          <Input
            bg="white"
            placeholder="Type the location..."
            defaultValue={filter}
            onSubmitEditing={(e) => {
              navigation.setParams({ filter: e.nativeEvent.text });
            }}
          />
        </Center>

        <Box p={3} borderTopRadius={"lg"} mt={-3} bg="light.100">
          <Heading mb={3} fontSize={"md"} key="2">
            Locations
          </Heading>

          {data?.rows.map((item) => (
            <Pressable
              key={item.location}
              onPress={() =>
                navigation.navigate("ListMeters", { location: item.location })
              }
            >
              {({ isPressed }) => (
                <VStack
                  opacity={isPressed ? 0.5 : 1}
                  rounded={"lg"}
                  mb={3}
                  bg="white"
                >
                  <HStack
                    alignItems={"center"}
                    p={5}
                    borderBottomWidth={1}
                    borderBottomColor={"light.200"}
                  >
                    <Icon
                      as={FontAwesome}
                      color="primary.500"
                      name="info"
                      mr={2}
                    />
                    <Text fontSize="lg" fontStyle={"italic"}>
                      Meters
                    </Text>
                    <Text
                      flexGrow={1}
                      textAlign={"right"}
                      fontWeight={"bold"}
                      color="primary.500"
                      fontSize="lg"
                    >
                      {item.meterCount}
                    </Text>
                  </HStack>
                  <HStack p={5} alignItems={"center"}>
                    <Icon
                      as={FontAwesome}
                      color="primary.500"
                      name="building"
                      mr={2}
                    />
                    <Text fontSize="lg" fontStyle={"italic"}>
                      Location
                    </Text>
                    <Text
                      flexGrow={1}
                      textAlign={"right"}
                      fontWeight={"bold"}
                      color="primary.500"
                      fontSize="lg"
                    >
                      {item.location}
                    </Text>
                  </HStack>
                </VStack>
              )}
            </Pressable>
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}

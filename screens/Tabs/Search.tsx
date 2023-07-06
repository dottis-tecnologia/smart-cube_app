import {
  Box,
  FlatList,
  HStack,
  Heading,
  Icon,
  Input,
  Pressable,
  VStack,
  Text,
} from "native-base";
import FocusAwareStatusBar from "../../components/util/FocusAwareStatusBar";
import { dbQuery } from "../../util/db";
import useQuery from "../../hooks/useQuery";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParamList } from "./Tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Root";
import { FontAwesome } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";

export type SearchProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Search">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function Search({ navigation, route }: SearchProps) {
  const filter = route.params?.filter || "";
  const { data } = useQuery(
    () =>
      dbQuery<{
        id: string;
        location: string;
      }>("SELECT * FROM meters WHERE id LIKE ?", [`%${filter}%`]),
    [filter],
    { isDisabled: filter.length <= 2 }
  );

  return (
    <>
      <FocusAwareStatusBar style="dark" />

      <FlatList
        flex={1}
        _contentContainerStyle={{
          backgroundColor: "light.100",
          p: 3,
          borderTopRadius: "lg",
        }}
        ListHeaderComponent={
          <Box mb={3}>
            <Heading mb={3} fontSize={"md"} key="2">
              Search
            </Heading>
            <Input
              bg="white"
              placeholder="Search by id..."
              defaultValue={filter}
              onSubmitEditing={(e) => {
                navigation.navigate("Search", { filter: e.nativeEvent.text });
              }}
            />
          </Box>
        }
        data={data?.rows}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("Meter", { id: item.id })}
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
                    Meter
                  </Text>
                  <Text
                    flexGrow={1}
                    textAlign={"right"}
                    fontWeight={"bold"}
                    color="primary.500"
                    fontSize="lg"
                  >
                    {item.id}
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
        )}
        keyExtractor={(item) => item.location}
      />
    </>
  );
}

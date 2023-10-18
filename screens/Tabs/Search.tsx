import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { TabParamList } from "./Tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Root";
import {
  Box,
  Center,
  Text,
  Heading,
  HStack,
  Icon,
  VStack,
  Pressable,
  Input,
  FlatList,
  Spinner,
} from "native-base";
import { dbQuery } from "../../util/db";
import { FontAwesome } from "@expo/vector-icons";
import useInfiniteQuery from "../../hooks/useInfiniteQuery";
import { memo } from "react";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import useStatusBar from "../../hooks/useStatusBar";

export type LocationsProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Search">,
  NativeStackScreenProps<RootStackParamList>
>;

const perPage = 8;
type DataType = {
  id: string;
  name: string;
  location: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Locations({ navigation, route }: LocationsProps) {
  useStatusBar({ style: "dark" });
  const filter = route.params?.filter || "";
  const { data, fetchNextPage, isFinished, isRefreshing, refresh } =
    useInfiniteQuery(
      (pageParam: string) =>
        dbQuery<DataType>(
          `SELECT *
          FROM meters 
          WHERE UPPER(name) LIKE UPPER(?) AND name > ?
          ORDER BY name LIMIT ?`,
          [`%${filter}%`, pageParam, perPage]
        ),
      (lastPage) => {
        if (lastPage == null) {
          return "";
        }

        if (lastPage.rows.length < perPage) {
          return null;
        }

        return lastPage.rows[lastPage.rows.length - 1].name;
      },
      [filter],
      { isDisabled: filter.length < 3 }
    );

  const flatData = data.reduce<DataType[]>(
    (prev, curr) => [...prev, ...curr.rows],
    []
  );

  return (
    <Box bg="light.100" flex={1}>
      <FlatList
        ListHeaderComponent={
          <>
            <Center
              key="heading"
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
                  {t("search.search", "Search").toUpperCase()}
                </Heading>
              </Box>
              <Input
                key="2"
                variant={"filled"}
                placeholder={t("search.typeId", "Type the id...")}
                defaultValue={filter}
                onSubmitEditing={(e) => {
                  navigation.setParams({ filter: e.nativeEvent.text });
                }}
              />
            </Center>
            <Heading
              key="title"
              mt={-3}
              bg="light.100"
              mb={3}
              fontSize={"md"}
              p={3}
              borderTopRadius={"lg"}
            >
              {t("search.meters", "Meters")}
            </Heading>
          </>
        }
        data={flatData}
        flex={1}
        onEndReached={() => !isFinished && fetchNextPage()}
        refreshing={isRefreshing}
        onRefresh={refresh}
        keyExtractor={({ id }) => id}
        ListFooterComponent={
          !isFinished ? (
            <Center p={5}>
              <Spinner />
            </Center>
          ) : null
        }
        renderItem={({ item }) => (
          <ListItem
            location={item.location}
            name={item.name}
            onPress={() => navigation.navigate("Meter", { id: item.id })}
          />
        )}
      />
    </Box>
  );
}

const ListItem = memo(
  ({
    location,
    name,
    onPress,
  }: {
    location: string;
    name: string;
    onPress: () => void;
  }) => {
    const { t } = useTranslation();
    return (
      <AnimatedPressable
        onPress={onPress}
        mx={3}
        mb={2}
        entering={FadeInLeft.delay(150).randomDelay()}
      >
        <VStack rounded={"lg"} bg="white">
          <HStack
            alignItems={"center"}
            p={5}
            borderBottomWidth={1}
            borderBottomColor={"light.200"}
          >
            <Icon as={FontAwesome} color="primary.500" name="info" mr={2} />
            <Text fontSize="lg" fontStyle={"italic"} mr={1}>
              {t("search.meter", "Meter")}
            </Text>
            <Text
              flexGrow={1}
              textAlign={"right"}
              fontWeight={"bold"}
              color="primary.500"
              fontSize="lg"
            >
              {name}
            </Text>
          </HStack>
          <HStack p={5} alignItems={"center"}>
            <Icon as={FontAwesome} color="primary.500" name="building" mr={2} />
            <Text fontSize="lg" fontStyle={"italic"} mr={1}>
              {t("search.location", "Location")}
            </Text>
            <Text
              flex={1}
              flexGrow={1}
              textAlign={"right"}
              fontWeight={"bold"}
              color="primary.500"
              fontSize="lg"
              numberOfLines={1}
            >
              {location}
            </Text>
          </HStack>
        </VStack>
      </AnimatedPressable>
    );
  }
);

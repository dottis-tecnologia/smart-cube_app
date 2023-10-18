import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { TabParamList } from "./Tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Root";
import FocusAwareStatusBar from "../../components/util/FocusAwareStatusBar";
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

export type LocationsProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Locations">,
  NativeStackScreenProps<RootStackParamList>
>;

const perPage = 8;
type DataType = { location: string; meterCount: number };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Locations({ navigation, route }: LocationsProps) {
  const { t } = useTranslation();
  const filter = route.params?.filter || "";
  const { data, fetchNextPage, isFinished, isRefreshing, refresh } =
    useInfiniteQuery(
      (pageParam: string) =>
        dbQuery<DataType>(
          `SELECT count(id) as meterCount, location 
          FROM meters 
          WHERE UPPER(location) LIKE UPPER(?) 
          GROUP BY location 
          HAVING location > ? 
          ORDER BY location LIMIT ?`,
          [`%${filter}%`, pageParam, perPage]
        ),
      (lastPage) => {
        if (lastPage == null) {
          return "";
        }

        if (lastPage.rows.length < perPage) {
          return null;
        }

        return lastPage.rows[lastPage.rows.length - 1].location;
      },
      [filter]
    );

  const flatData = data.reduce<DataType[]>(
    (prev, curr) => [...prev, ...curr.rows],
    []
  );

  return (
    <Box bg="light.100" flex={1}>
      <FocusAwareStatusBar style="dark" />
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
                  {t("location.location", "Location").toUpperCase()}
                </Heading>
              </Box>
              <Input
                key="2"
                variant={"filled"}
                placeholder={t("location.typeLocation", "Type the location...")}
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
              {t("location.locations", "Locations")}
            </Heading>
          </>
        }
        data={flatData}
        flex={1}
        onEndReached={() => !isFinished && fetchNextPage()}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListFooterComponent={
          !isFinished ? (
            <Center p={5}>
              <Spinner />
            </Center>
          ) : null
        }
        renderItem={({ item }) => (
          <ListItem
            {...item}
            onPress={() =>
              navigation.navigate("ListMeters", { location: item.location })
            }
          />
        )}
      />
    </Box>
  );
}

const ListItem = memo(
  ({
    location,
    meterCount,
    onPress,
  }: {
    location: string;
    meterCount: number;
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
              {t("location.meters", "Meters")}
            </Text>
            <Text
              flexGrow={1}
              textAlign={"right"}
              fontWeight={"bold"}
              color="primary.500"
              fontSize="lg"
            >
              {meterCount}
            </Text>
          </HStack>
          <HStack p={5} alignItems={"center"}>
            <Icon as={FontAwesome} color="primary.500" name="building" mr={2} />
            <Text fontSize="lg" fontStyle={"italic"} mr={1}>
              {t("location.location", "Location")}
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

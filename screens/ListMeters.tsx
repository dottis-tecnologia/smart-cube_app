import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import FocusAwareStatusBar from "../components/util/FocusAwareStatusBar";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Heading,
  Icon,
  Image,
  Pressable,
  Spinner,
  Text,
  VStack,
} from "native-base";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { formatDistanceToNow, intlFormat, isToday } from "date-fns";
import useQuery from "../hooks/useQuery";
import { dbQuery } from "../util/db";
import trpc from "../util/trpc";
import { getToken } from "../util/authToken";
import useAuth from "../hooks/useAuth";

export type ListMetersProps = NativeStackScreenProps<
  RootStackParamList,
  "ListMeters"
>;

const AnimatedHStack = Animated.createAnimatedComponent(HStack);

const HEADER_HEIGHT = 200;

export default function ListMeters({
  route: { params },
  navigation,
}: ListMetersProps) {
  const { location } = params;
  const { data } = useQuery(
    () =>
      dbQuery<{
        id: string;
        createdAt?: string;
      }>(
        "SELECT meters.id, MAX(readings.createdAt) as createdAt FROM meters LEFT JOIN readings ON readings.meterId = meters.id WHERE meters.location = ? GROUP BY meters.id",
        [location]
      ),
    [location]
  );
  const { data: readingsToday } = useQuery(
    () =>
      dbQuery<{
        count: number;
      }>(
        "SELECT COUNT(readings.id) as count FROM readings JOIN meters ON readings.meterId = meters.id WHERE meters.location = ? AND date(createdAt) == date('now')",
        [location]
      ),
    [location]
  );

  return (
    <Box flex={1} bg="light.100">
      <FocusAwareStatusBar style="dark" />
      <Center
        h={HEADER_HEIGHT}
        position={"absolute"}
        top={0}
        left={0}
        right={0}
        key="1"
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
          <Heading color="white">
            <Text fontWeight={"normal"} fontStyle={"italic"}>
              LOCATION:
            </Text>{" "}
            {location}
          </Heading>
          <Text color="white">
            Readings today: {readingsToday?.rows[0].count}/{data?.rows.length}
          </Text>
        </Box>
      </Center>
      <FlatList
        flex={1}
        _contentContainerStyle={{
          marginTop: HEADER_HEIGHT - 12,
          paddingBottom: HEADER_HEIGHT - 12,
          backgroundColor: "light.100",
          p: 3,
          borderTopRadius: "lg",
        }}
        ListHeaderComponent={
          <>
            <Heading mb={3} fontSize={"md"} key="2">
              Meters
            </Heading>
          </>
        }
        data={data?.rows}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("Meter", { id: item.id })}
          >
            {({ isPressed }) => (
              <HStack
                opacity={isPressed ? 0.5 : 1}
                bg={
                  item.createdAt && isToday(new Date(item.createdAt))
                    ? "success.500"
                    : "warning.500"
                }
                rounded={"lg"}
                mb={3}
                p={3}
              >
                <VStack>
                  <Text fontWeight={"bold"} fontSize="lg" color="white">
                    {item.id}
                  </Text>
                  <Text color="white">
                    Last reading{" "}
                    {item.createdAt
                      ? formatDistanceToNow(new Date(item.createdAt), {
                          addSuffix: true,
                        })
                      : "never"}
                  </Text>
                </VStack>
              </HStack>
            )}
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
}

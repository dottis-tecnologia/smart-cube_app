import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import FocusAwareStatusBar from "../components/util/FocusAwareStatusBar";
import {
  AspectRatio,
  Box,
  Fab,
  FlatList,
  HStack,
  Heading,
  Icon,
  Image,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import Animated, {
  FadeInLeft,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import { intlFormat } from "date-fns";
import { useIsFocused } from "@react-navigation/native";

export type MeterProps = NativeStackScreenProps<RootStackParamList, "Meter">;

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedHStack = Animated.createAnimatedComponent(HStack);

const readings = [
  {
    id: 0,
    technician: "John Smith",
    value: 34743,
    created_at: new Date(2023, 3, 18, 18, 35, 23),
  },
  {
    id: 1,
    technician: "John Smith",
    value: 34700,
    created_at: new Date(2023, 3, 18, 18, 35, 23),
  },
  {
    id: 2,
    technician: "John Doe",
    value: 34643,
    created_at: new Date(2023, 3, 18, 18, 35, 23),
  },
  {
    id: 3,
    technician: "John Smith",
    value: 34610,
    created_at: new Date(2023, 3, 18, 18, 35, 23),
  },
];

export default function Meter({ route: { params }, navigation }: MeterProps) {
  const { id } = params;
  const meter = {
    id,
    unit: "kWh",
    location: "BUILD-075",
  };
  const isFocused = useIsFocused();

  return (
    <>
      <FocusAwareStatusBar style="dark" />
      {isFocused && (
        <Fab
          placement="bottom-right"
          colorScheme="primary"
          size="lg"
          icon={<Icon name="plus" pl={0.5} as={FontAwesome} />}
          onPress={() => navigation.navigate("CreateReading", { id })}
        />
      )}
      <FlatList
        ListHeaderComponent={
          <Box>
            <AspectRatio ratio={1}>
              <Image
                source={require("../assets/meter.jpg")}
                resizeMode="cover"
                w={"100%"}
                h={"100%"}
                alt="meter picture"
              />
            </AspectRatio>
            <Box p={3}>
              <AnimatedHStack
                entering={FadeInLeft}
                space={1}
                alignItems={"center"}
              >
                <Icon as={FontAwesome} name="tag" color="primary.400" key="1" />
                <Text key="2">Meter ID: </Text>
                <Text
                  fontWeight={"bold"}
                  color="primary.400"
                  fontSize={"lg"}
                  key="3"
                >
                  {meter.id}
                </Text>
              </AnimatedHStack>
              <AnimatedHStack
                entering={FadeInLeft.delay(200)}
                space={1}
                alignItems={"center"}
              >
                <Icon
                  as={FontAwesome}
                  name="map-pin"
                  color="primary.400"
                  key="1"
                />
                <Text key="2">Location: </Text>
                <Text
                  fontWeight={"bold"}
                  color="primary.400"
                  fontSize={"lg"}
                  key="3"
                >
                  {meter.location}
                </Text>
                {/* For some reason RN is complaining about the missing key parameter here, don't know why */}
              </AnimatedHStack>
            </Box>
            <Heading m={3} fontSize={"md"}>
              Last readings
            </Heading>
          </Box>
        }
        data={readings}
        renderItem={({ item }) => (
          <AnimatedBox
            entering={FadeInLeft.delay(300).randomDelay()}
            px={5}
            py={3}
            mx={3}
            mb={3}
            bg="lime.500"
            rounded="lg"
          >
            <HStack alignItems={"center"}>
              <VStack flex={1}>
                <Text color="white" fontWeight="bold">
                  {item.technician}
                </Text>
                <Text color="white">
                  {intlFormat(item.created_at, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </Text>
              </VStack>
              <Text color="white" fontWeight={"bold"}>
                {item.value} {meter.unit}
              </Text>
            </HStack>
          </AnimatedBox>
        )}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </>
  );
}

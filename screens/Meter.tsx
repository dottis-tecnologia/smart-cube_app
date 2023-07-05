import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import FocusAwareStatusBar from "../components/util/FocusAwareStatusBar";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Fab,
  FlatList,
  HStack,
  Heading,
  Icon,
  Image,
  Spinner,
  Text,
  VStack,
} from "native-base";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { formatDistanceToNow, intlFormat } from "date-fns";
import { useIsFocused } from "@react-navigation/native";
import useQuery from "../hooks/useQuery";
import { dbQuery } from "../util/db";
import * as FileSystem from "expo-file-system";
import { useEffect } from "react";

export type MeterProps = NativeStackScreenProps<RootStackParamList, "Meter">;

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedHStack = Animated.createAnimatedComponent(HStack);

export default function Meter({ route: { params }, navigation }: MeterProps) {
  const { id } = params;
  const { data: meterData } = useQuery(() =>
    dbQuery<{
      id: string;
      location: string;
      unit: string;
      imagePath: string;
    }>("SELECT * FROM meters WHERE id = ?;", [id])
  );
  const { data: readings } = useQuery(() =>
    dbQuery<{
      id: string;
      meterId: string;
      value: number;
      createdAt: string;
      imagePath: string;
    }>("SELECT * FROM readings WHERE meterId = ? ORDER BY createdAt DESC;", [
      id,
    ])
  );

  const isFocused = useIsFocused();

  if (meterData == null) {
    return (
      <Center flex={1}>
        <FocusAwareStatusBar style="dark" />
        <Spinner />
      </Center>
    );
  }

  if (meterData.rows.length === 0) {
    return (
      <Center flex={1}>
        <FocusAwareStatusBar style="dark" />
        <Text mb={3}>The meter with id {id} was not found</Text>
        <Button
          variant="ghost"
          leftIcon={<Icon as={FontAwesome} name="arrow-left" />}
          onPress={() => navigation.goBack()}
        >
          Go back
        </Button>
      </Center>
    );
  }

  const meter = meterData.rows[0];

  return (
    <>
      <FocusAwareStatusBar style="dark" />
      {isFocused && (
        <Fab
          placement="bottom-right"
          colorScheme="primary"
          size="lg"
          icon={<Icon name="plus" pl={0.5} as={FontAwesome} />}
          onPress={() => navigation.navigate("CreateReading", { meterId: id })}
        />
      )}
      <FlatList
        ListHeaderComponent={
          <Box>
            <AspectRatio ratio={1}>
              {meter.imagePath ? (
                <Image
                  source={{
                    uri: meter.imagePath,
                  }}
                  resizeMode="cover"
                  w={"100%"}
                  h={"100%"}
                  alt="meter picture"
                />
              ) : (
                <Center flex={1} bg="black">
                  <Icon
                    as={FontAwesome5}
                    name="image"
                    size={24}
                    color="light.800"
                  />
                </Center>
              )}
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
              Latest readings
            </Heading>
          </Box>
        }
        data={readings?.rows}
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
                  John Smith
                </Text>
                <Text color="white">
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
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

import { deleteDatabase, getDatabase, dbQuery } from "../../util/db";
import {
  Box,
  Button,
  FlatList,
  HStack,
  Heading,
  Icon,
  IconButton,
  Text,
  VStack,
  useToast,
} from "native-base";
import FocusAwareStatusBar from "../../components/util/FocusAwareStatusBar";
import { FontAwesome } from "@expo/vector-icons";
import useMutation from "../../hooks/useMutation";
import { syncMeters } from "../../util/sync";
import useQuery from "../../hooks/useQuery";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { intlFormat } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";
import trpc from "../../util/trpc";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type SyncProps = {};

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedHStack = Animated.createAnimatedComponent(HStack);

const getReadings = () =>
  dbQuery<{
    id: string;
    meterId: string;
    value: number;
    unit: string;
    createdAt: string;
  }>(
    "SELECT readings.*, meters.unit FROM readings JOIN meters ON readings.meterId = meters.id WHERE readings.synchedAt IS NULL;"
  );

export default function Sync({}: SyncProps) {
  const toast = useToast();
  const { data: readings, refetch: refetchReadings } = useQuery(getReadings);
  const { data: lastSync, refetch: refetchLastSync } = useQuery(async () => {
    const lastSync = await AsyncStorage.getItem("last-sync");
    if (lastSync == null) return null;

    return new Date(lastSync);
  });

  const { mutate, isMutating } = useMutation(syncMeters, {
    onSuccess: () =>
      toast.show({
        title: "Success",
        description: "Data synchronized successfully",
        colorScheme: "green",
      }),
  });
  const { mutate: deleteDb, isMutating: isDeletingDb } = useMutation(
    deleteDatabase,
    {
      onSuccess: () => {
        refetchLastSync();
        refetchReadings();
      },
    }
  );

  return (
    <>
      <FocusAwareStatusBar style="dark" />
      <FlatList
        ListFooterComponent={
          <Box>
            <Button
              isLoading={isDeletingDb}
              colorScheme={"red"}
              onPress={() => deleteDb()}
            >
              Delete local datebase
            </Button>
          </Box>
        }
        ListHeaderComponent={
          <>
            <Box
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
              <HStack
                space={3}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box key="1">
                  <Heading color="white">Sync</Heading>
                  <Text color="light.700">Last synchronization:</Text>
                  <Text color="white">
                    {lastSync
                      ? intlFormat(lastSync, {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "numeric",
                          minute: "numeric",
                        })
                      : "never"}
                  </Text>
                </Box>
                <Button
                  key="2"
                  leftIcon={<Icon as={FontAwesome} name="refresh" />}
                  colorScheme={"green"}
                  onPress={() => mutate()}
                  isLoading={isMutating}
                >
                  Sync
                </Button>
              </HStack>
            </Box>

            <Heading m={3} fontSize={"md"} key="2">
              Latest readings
            </Heading>
          </>
        }
        data={readings?.rows}
        renderItem={({ item }) => <ReadingItem item={item} />}
        keyExtractor={(item) => item.id}
      />
      <Box p={3} borderRadius={"lg"} mt={-2} bg="light.50" key="2"></Box>
    </>
  );
}

function ReadingItem({
  item,
}: {
  item: {
    id: string;
    value: number;
    meterId: string;
    createdAt: string;
    unit: string;
  };
}) {
  const { isSuccess, mutate, error, isError, isMutating } = useMutation(
    trpc.readings.create.mutate
  );
  console.log(error);

  return (
    <AnimatedHStack
      key={item.id}
      p={5}
      mb={3}
      mx={3}
      bg={isSuccess ? "green.500" : "red.500"}
      opacity={isMutating ? 0.5 : 1}
      rounded="lg"
      alignItems="center"
      space={5}
      entering={SlideInLeft.delay(200).randomDelay()}
    >
      <VStack flex={1}>
        <Text color="white" key="1">
          {item.meterId}
        </Text>
        <Text color="white" key="2">
          {intlFormat(new Date(item.createdAt), {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
          })}
        </Text>
      </VStack>
      <Text color="white" fontWeight={"bold"}>
        {item.value} {item.unit}
      </Text>
      <IconButton
        colorScheme={"white"}
        variant={"ghost"}
        isDisabled={isMutating}
        onPress={() => mutate({ ...item, createdAt: new Date(item.createdAt) })}
        _icon={{ as: FontAwesome, name: "refresh", color: "white" }}
      />
    </AnimatedHStack>
  );
}

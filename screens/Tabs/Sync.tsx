import { deleteDatabase, dbQuery } from "../../util/db";
import {
  Box,
  Button,
  FlatList,
  HStack,
  Heading,
  Icon,
  IconButton,
  Popover,
  Text,
  VStack,
  useToast,
} from "native-base";
import FocusAwareStatusBar from "../../components/util/FocusAwareStatusBar";
import { FontAwesome } from "@expo/vector-icons";
import useMutation from "../../hooks/useMutation";
import useQuery from "../../hooks/useQuery";
import Animated, { SlideInLeft, SlideOutRight } from "react-native-reanimated";
import { formatDistanceToNow } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { syncData } from "../../util/sync/sync";
import { sendReading } from "../../util/sync/readings";

export type SyncProps = {};

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

  const { mutate, isMutating } = useMutation(syncData, {
    onSuccess: () => {
      toast.show({
        title: "Success",
        description: "Data synchronized successfully",
        colorScheme: "green",
      });
      refetchReadings();
      refetchLastSync();
    },
  });

  return (
    <>
      <FocusAwareStatusBar style="dark" />
      <FlatList
        ListFooterComponent={
          <Box p={3}>
            <DeleteDBButton
              onSuccess={() => {
                refetchLastSync();
                refetchReadings();
              }}
            />
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
                  <Text color="white" opacity={0.7}>
                    Last synchronization:
                  </Text>
                  <Text color="white" opacity={0.8}>
                    {lastSync
                      ? formatDistanceToNow(lastSync, {
                          addSuffix: true,
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
  const { isSuccess, mutate, error, isError, isMutating } =
    useMutation(sendReading);

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
      exiting={SlideOutRight.delay(200).randomDelay()}
    >
      <VStack flex={1}>
        <Text color="white" key="1">
          {item.meterId}
        </Text>
        <Text color="white" key="2">
          {formatDistanceToNow(new Date(item.createdAt), {
            addSuffix: true,
          })}
        </Text>
        {isError ? <Text color="white">{error?.message}</Text> : null}
      </VStack>
      <Text color="white" fontWeight={"bold"}>
        {item.value} {item.unit}
      </Text>
      <IconButton
        colorScheme={"white"}
        variant={"ghost"}
        isDisabled={isMutating}
        onPress={() => mutate(item)}
        _icon={{ as: FontAwesome, name: "refresh", color: "white" }}
      />
    </AnimatedHStack>
  );
}

type DeleteDBButtonProps = {
  onSuccess?: () => void;
};
function DeleteDBButton({ onSuccess }: DeleteDBButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  const { mutate: deleteDb, isMutating: isDeletingDb } = useMutation(
    deleteDatabase,
    {
      onSuccess: () => {
        onSuccess?.();
        toast.show({
          title: "Success",
          description: "Database deleted successfully",
        });
      },
    }
  );

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={(triggerProps) => {
        return (
          <Button
            {...triggerProps}
            colorScheme="danger"
            isLoading={isDeletingDb}
          >
            Delete Database
          </Button>
        );
      }}
    >
      <Popover.Content accessibilityLabel="Delete Database" m={3}>
        <Popover.Arrow />
        <Popover.CloseButton />
        <Popover.Header>Delete Customer</Popover.Header>
        <Popover.Body>
          This action will delete the local database and all the data stored in
          this device, any unsynchronized data will be lost, be careful when
          using this option
        </Popover.Body>
        <Popover.Footer justifyContent="flex-end">
          <Button.Group space={2}>
            <Button
              colorScheme="coolGray"
              variant="ghost"
              onPress={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="danger"
              onPress={() => {
                deleteDb();
                setIsOpen(false);
              }}
            >
              Delete
            </Button>
          </Button.Group>
        </Popover.Footer>
      </Popover.Content>
    </Popover>
  );
}

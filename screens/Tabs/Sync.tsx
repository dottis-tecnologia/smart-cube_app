import { deleteDatabase, dbQuery } from "../../util/db";
import {
  Box,
  Button,
  Center,
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
import useAuth from "../../hooks/useAuth";
import { getToken } from "../../util/authToken";

export type SyncProps = {};

const AnimatedHStack = Animated.createAnimatedComponent(HStack);

const getReadings = () =>
  dbQuery<{
    id: string;
    meterId: string;
    value: number;
    unit: string;
    createdAt: string;
    imagePath: string;
  }>(
    "SELECT readings.*, meters.unit FROM readings JOIN meters ON readings.meterId = meters.id WHERE readings.synchedAt IS NULL;"
  );

const HEADER_HEIGHT = 200;

export default function Sync({}: SyncProps) {
  const toast = useToast();
  const { refreshToken } = useAuth();
  const { data: readings, refetch: refetchReadings } = useQuery(
    getReadings,
    []
  );
  const { data: lastSync, refetch: refetchLastSync } = useQuery(async () => {
    const lastSync = await AsyncStorage.getItem("last-sync");
    if (lastSync == null) return null;

    return new Date(lastSync);
  }, []);

  const { mutate, isMutating } = useMutation(syncData, {
    onSuccess() {
      toast.show({
        title: "Success",
        description: "Data synchronized successfully",
        colorScheme: "green",
      });
      refetchReadings();
      refetchLastSync();
    },
    onError(e) {
      toast.show({
        title: "Error",
        description: e.message,
        colorScheme: "danger",
      });
    },
    async beforeRequest() {
      if (getToken() == null) await refreshToken();
    },
  });

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
        <HStack
          w="full"
          space={3}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box key="1">
            <Heading color="white">SYNC</Heading>
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
        </HStack>
      </Center>
      <FlatList
        flex={1}
        ItemSeparatorComponent={() => <Box mb={3}></Box>}
        _contentContainerStyle={{
          marginTop: HEADER_HEIGHT - 12,
          paddingBottom: HEADER_HEIGHT - 12,
          backgroundColor: "light.100",
          p: 3,
          borderTopRadius: "lg",
        }}
        ListHeaderComponent={
          <>
            <Button
              mb={3}
              key="1"
              leftIcon={<Icon as={FontAwesome} name="refresh" />}
              colorScheme={"green"}
              onPress={() => mutate()}
              isLoading={isMutating}
            >
              Sync
            </Button>

            <DeleteDBButton
              key="3"
              onSuccess={() => {
                refetchLastSync();
                refetchReadings();
              }}
            />
            <Heading mb={3} fontSize={"md"} key="2">
              Latest readings
            </Heading>
          </>
        }
        data={readings?.rows}
        renderItem={({ item }) => <ReadingItem item={item} />}
        keyExtractor={(item) => item.id}
      />
    </Box>
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
    imagePath: string;
    unit: string;
  };
}) {
  return (
    <AnimatedHStack
      key={item.id}
      p={5}
      bg={"red.500"}
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
      </VStack>
      <Text color="white" fontWeight={"bold"}>
        {item.value} {item.unit}
      </Text>
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
            mb={3}
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

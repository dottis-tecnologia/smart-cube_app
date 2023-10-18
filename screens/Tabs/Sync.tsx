import { deleteDatabase, dbQuery } from "../../util/db";
import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Icon,
  Modal,
  Text,
  VStack,
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
import ParallaxScroll from "../../components/ParallaxScroll";
import { useTranslation } from "react-i18next";
import dateFnsLocale from "../../util/dateFnsLocale";

export type SyncProps = {};

const AnimatedHStack = Animated.createAnimatedComponent(HStack);

const getReadings = () =>
  dbQuery<{
    id: string;
    meterId: string;
    meterName: string;
    value: number;
    unit: string;
    createdAt: string;
    imagePath: string;
  }>(
    "SELECT readings.*, meters.unit, meters.name as meterName FROM readings JOIN meters ON readings.meterId = meters.id WHERE readings.synchedAt IS NULL;"
  );

export default function Sync({}: SyncProps) {
  const { refreshToken } = useAuth();
  const { t, i18n } = useTranslation();
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
      refetchReadings();
      refetchLastSync();
    },
    async beforeRequest() {
      if (getToken() == null) await refreshToken();
    },
  });

  return (
    <Box flex={1} bg="light.100">
      <FocusAwareStatusBar style="dark" />
      <ParallaxScroll
        header={
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
            <HStack
              w="full"
              space={3}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box key="1">
                <Heading color="white">{t("sync.sync", "Sync")}</Heading>
                <Text color="white" opacity={0.7}>
                  {t("sync.lastSync", "Last synchronization:")}
                </Text>
                <Text color="white" opacity={0.8}>
                  {lastSync
                    ? formatDistanceToNow(lastSync, {
                        addSuffix: true,
                        locale: dateFnsLocale(i18n.resolvedLanguage),
                      })
                    : "never"}
                </Text>
              </Box>
              <Button
                mb={3}
                key="2"
                leftIcon={<Icon as={FontAwesome} name="refresh" />}
                colorScheme={"green"}
                onPress={() => mutate()}
                isLoading={isMutating}
              >
                {t("sync.sync", "Sync")}
              </Button>
            </HStack>
          </Center>
        }
        flex={1}
      >
        <Box p={3} borderTopRadius={"lg"} mt={-3} bg="light.100">
          <Heading mb={3} fontSize={"md"} key="2">
            {t("sync.unsentReadings", "Unsent readings")}
          </Heading>

          {readings?.rows.map((item) => (
            <ReadingItem key={item.id} item={item} />
          ))}
          <DeleteDBButton
            key="3"
            onSuccess={() => {
              refetchLastSync();
              refetchReadings();
            }}
          />
        </Box>
      </ParallaxScroll>
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
  const { i18n } = useTranslation();

  return (
    <AnimatedHStack
      key={item.id}
      p={5}
      bg={"red.500"}
      rounded="lg"
      mb={3}
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
            locale: dateFnsLocale(i18n.resolvedLanguage),
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
  const { mutate: deleteDb, isMutating: isDeletingDb } = useMutation(
    deleteDatabase,
    {
      onSuccess: () => {
        onSuccess?.();
      },
    }
  );
  const { t } = useTranslation();

  return (
    <>
      <Button
        colorScheme="danger"
        mb={3}
        isLoading={isDeletingDb}
        onPress={() => setIsOpen(true)}
      >
        {t("sync.deleteLocal", "Delete local data")}
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} safeArea>
        <Modal.Content accessibilityLabel="Delete Database" m={3}>
          <Modal.CloseButton />
          <Modal.Header>
            {t("sync.deleteDatabaseTitle", "Delete Database")}
          </Modal.Header>
          <Modal.Body>
            {t(
              "sync.deleteDatabaseBody",
              "This action will delete the local database and all the data stored in this device, any unsynchronized data will be lost, be careful when using this option"
            )}
          </Modal.Body>
          <Modal.Footer justifyContent="flex-end">
            <Button.Group space={2}>
              <Button
                colorScheme="coolGray"
                variant="ghost"
                onPress={() => setIsOpen(false)}
              >
                {t("cancel", "Cancel")}
              </Button>
              <Button
                colorScheme="danger"
                onPress={() => {
                  deleteDb();
                  setIsOpen(false);
                }}
              >
                {t("delete", "Delete")}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}

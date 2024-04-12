import { deleteDatabase, dbQuery, databasePath } from "../../util/db";
import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Icon,
  Input,
  Modal,
  Pressable,
  Text,
  VStack,
  useToast,
} from "native-base";
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
import useStatusBar from "../../hooks/useStatusBar";
import { shareAsync } from "expo-sharing";

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
    "SELECT readings.*, meters.unit, meters.name as meterName FROM readings JOIN meters ON readings.meterId = meters.id WHERE readings.synchedAt IS NULL;",
  );

export default function Sync({}: SyncProps) {
  useStatusBar({ style: "dark" });
  const { refreshToken } = useAuth();
  const { t, i18n } = useTranslation();
  const { data: readings, refetch: refetchReadings } = useQuery(
    getReadings,
    [],
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

          <Text color="gray.500" p={1} textAlign={"center"} mb={3}>
            <Icon as={FontAwesome} name="pencil" w={4} h={4} />{" "}
            {t(
              "readings.longPressToEdit",
              "Press and hold on an item to edit its value",
            )}
          </Text>

          {readings?.rows.map((item) => (
            <ReadingItem
              key={item.id}
              item={item}
              onUpdate={() => refetchReadings()}
            />
          ))}
          <HStack flexWrap={"wrap"} space={3} justifyContent={"center"}>
            <ShareDBButton />
            <DeleteDBButton
              key="3"
              onSuccess={() => {
                refetchLastSync();
                refetchReadings();
              }}
            />
          </HStack>
        </Box>
      </ParallaxScroll>
    </Box>
  );
}

function ReadingItem({
  item,
  onUpdate,
}: {
  item: {
    id: string;
    value: number;
    meterName: string;
    createdAt: string;
    imagePath: string;
    unit: string;
  };
  onUpdate?: () => void;
}) {
  const { i18n, t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [reading, setReading] = useState(
    item.value ? item.value.toString() : "",
  );
  const toast = useToast();
  const { isMutating, mutate } = useMutation(
    async (reading: number) => {
      await dbQuery(
        "UPDATE readings SET value = ? WHERE id = ?",
        [reading, item.id],
        false,
      );
    },
    {
      onSuccess: () => {
        onUpdate?.();
        setModalVisible(false);
      },
    },
  );

  const resetField = () => setReading(item.value ? item.value.toString() : "");

  return (
    <>
      <Modal
        isOpen={modalVisible}
        onClose={() => {
          resetField();
          setModalVisible(false);
        }}
        avoidKeyboard
        size="lg"
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{t("readings.update", "Update reading")}</Modal.Header>
          <Modal.Body>
            <Text mb="3">
              {t(
                "readings.mistakes",
                "You can update the value if you made any mistakes!",
              )}
            </Text>
            <Input
              keyboardType="numeric"
              selectTextOnFocus
              placeholder={t("reading.currentReading", "Current reading")}
              value={reading}
              onChangeText={(v) => setReading(v)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  resetField();
                  setModalVisible(false);
                }}
              >
                Cancel
              </Button>
              <Button
                isLoading={isMutating}
                onPress={() => {
                  const numberValue = +reading;
                  if (isNaN(numberValue)) {
                    toast.show({
                      description: t(
                        "reading.invalidValue",
                        "This value is invalid, please input a number",
                      ),
                    });
                    return;
                  }
                  mutate(numberValue);
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Pressable onLongPress={() => setModalVisible(true)}>
        {({ isPressed }) => (
          <AnimatedHStack
            key={item.id}
            p={5}
            bg={"red.500"}
            rounded="lg"
            mb={3}
            alignItems="center"
            space={5}
            style={{ transform: [{ scale: isPressed ? 0.95 : 1 }] }}
            entering={SlideInLeft.delay(200).randomDelay()}
            exiting={SlideOutRight.delay(200).randomDelay()}
          >
            <VStack flex={1}>
              <Text color="white" key="1">
                {item.meterName}
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
        )}
      </Pressable>
    </>
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
    },
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
              "This action will delete the local database and all the data stored in this device, any unsynchronized data will be lost, be careful when using this option",
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

type ShareDBButtonProps = {
  onSuccess?: () => void;
};
function ShareDBButton({ onSuccess }: ShareDBButtonProps) {
  const { mutate: shareDb, isMutating: isSharingDb } = useMutation(
    () => shareAsync(databasePath),

    {
      onSuccess: () => {
        onSuccess?.();
      },
    },
  );
  const { t } = useTranslation();

  return (
    <Button
      colorScheme="yellow"
      mb={3}
      isLoading={isSharingDb}
      onPress={() => shareDb()}
    >
      {t("sync.exportDb", "Export Database")}
    </Button>
  );
}

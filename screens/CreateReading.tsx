import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import NewReading from "../components/CreateReading/NewReading";
import { dbQuery } from "../util/db";
import { randomUUID } from "expo-crypto";
import useMutation from "../hooks/useMutation";
import { CameraCapturedPicture } from "expo-camera";
import { Button, Center, Modal, Spinner, Text } from "native-base";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { isAfter, sub } from "date-fns";
import useAuth from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import useStatusBar from "../hooks/useStatusBar";

export type CreateReadingProps = NativeStackScreenProps<
  RootStackParamList,
  "CreateReading"
>;

export default function CreateReading({
  navigation,
  route: { params },
}: CreateReadingProps) {
  useStatusBar({ style: "dark" });
  const { meterId } = params;
  const { userData } = useAuth();
  const { isMutating, mutate } = useMutation(
    async (snapshot: CameraCapturedPicture | null, reading: number) => {
      const readingId = randomUUID();

      let filePath: string | null = null;

      if (snapshot != null) {
        const uri = snapshot.uri;
        const extSplit = uri.split(".");
        const ext = extSplit[extSplit.length - 1];
        filePath = `${FileSystem.documentDirectory}pictures/${meterId}/${readingId}.${ext}`;

        await FileSystem.copyAsync({
          from: uri,
          to: filePath,
        });
      }

      await dbQuery(
        "INSERT INTO readings (id, meterId, value, createdAt, imagePath, technicianName, technicianId) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          readingId,
          meterId,
          reading,
          new Date().toISOString(),
          filePath,
          userData?.name,
          userData?.id,
        ],
        false
      );
    },
    {
      onSuccess: () => {
        navigation.navigate("Tabs");
      },
    }
  );
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    (async () => {
      const result = await dbQuery<{ createdAt: string }>(
        "SELECT MAX(createdAt) as createdAt FROM readings WHERE meterId = ?",
        [meterId]
      );

      const createdAt = result?.rows[0].createdAt;
      if (createdAt == null) return;

      if (isAfter(new Date(createdAt), sub(new Date(), { hours: 24 }))) {
        setShowAlert(true);
      }
    })();
  }, []);

  return (
    <>
      <Modal isOpen={showAlert} onClose={() => setShowAlert(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>
            {t("createReading.careful", "Be careful!")}
          </Modal.Header>
          <Modal.Body>
            <Text>
              {t(
                "createReading.carefulMessage",
                "Look's like there's another reading of this meter registered in the last 24 hours, please be careful to not send redundant data"
              )}
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex={1}
              colorScheme={"danger"}
              onPress={() => {
                setShowAlert(false);
              }}
            >
              {t("createReading.understand", "I understand")}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {isMutating ? (
        <Center flex={1}>
          <Spinner />
        </Center>
      ) : (
        <NewReading onConfirm={mutate} />
      )}
    </>
  );
}

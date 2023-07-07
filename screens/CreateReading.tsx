import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import FocusAwareStatusBar from "../components/util/FocusAwareStatusBar";
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

export type CreateReadingProps = NativeStackScreenProps<
  RootStackParamList,
  "CreateReading"
>;

export default function CreateReading({
  navigation,
  route: { params },
}: CreateReadingProps) {
  const { meterId } = params;
  const { userData } = useAuth();
  const { isMutating, mutate } = useMutation(
    async (snapshot: CameraCapturedPicture, reading: number) => {
      const readingId = randomUUID();

      const uri = snapshot.uri;
      const extSplit = uri.split(".");
      const ext = extSplit[extSplit.length - 1];
      const filePath = `${FileSystem.documentDirectory}pictures/${meterId}/${readingId}.${ext}`;

      await FileSystem.copyAsync({
        from: uri,
        to: filePath,
      });

      await dbQuery(
        "INSERT INTO readings (id, meterId, value, createdAt, imagePath, technicianName) VALUES (?, ?, ?, ?, ?, ?)",
        [
          readingId,
          meterId,
          reading,
          new Date().toISOString(),
          filePath,
          userData?.name,
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
      <FocusAwareStatusBar style="dark" />

      <Modal isOpen={showAlert} onClose={() => setShowAlert(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Be careful!</Modal.Header>
          <Modal.Body>
            <Text>
              Look's like there's another reading of this meter registered in
              the last 24 hours, please be careful to not send redundant data
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
              I understand
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

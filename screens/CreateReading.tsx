import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import FocusAwareStatusBar from "../components/util/FocusAwareStatusBar";
import NewReading from "../components/CreateReading/NewReading";
import { dbQuery } from "../util/db";
import { randomUUID } from "expo-crypto";
import useMutation from "../hooks/useMutation";
import { CameraCapturedPicture } from "expo-camera";
import { Center, Spinner } from "native-base";
import * as FileSystem from "expo-file-system";

export type CreateReadingProps = NativeStackScreenProps<
  RootStackParamList,
  "CreateReading"
>;

export default function CreateReading({
  navigation,
  route: { params },
}: CreateReadingProps) {
  const { meterId } = params;
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
        "INSERT INTO readings (id, meterId, value, createdAt, imagePath) VALUES (?, ?, ?, ?, ?)",
        [readingId, meterId, reading, new Date().toISOString(), filePath],
        false
      );
    },
    {
      onSuccess: () => {
        navigation.navigate("Tabs");
      },
    }
  );

  return (
    <>
      <FocusAwareStatusBar style="dark" />
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

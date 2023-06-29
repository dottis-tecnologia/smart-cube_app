import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import FocusAwareStatusBar from "../components/util/FocusAwareStatusBar";
import NewReading from "../components/CreateReading/NewReading";
import { query } from "../util/db";
import { randomUUID } from "expo-crypto";

export type CreateReadingProps = NativeStackScreenProps<
  RootStackParamList,
  "CreateReading"
>;

export default function CreateReading({
  navigation,
  route: { params },
}: CreateReadingProps) {
  const { id } = params;

  return (
    <>
      <FocusAwareStatusBar style="dark" />
      <NewReading
        onConfirm={async (snapshot, reading) => {
          await query(
            "INSERT INTO readings (id, meterId, value, createdAt) VALUES (?, ?, ?, ?)",
            [randomUUID(), id, reading, new Date().toISOString()],
            false
          );

          navigation.navigate("Tabs");
        }}
      />
    </>
  );
}

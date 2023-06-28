import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import FocusAwareStatusBar from "../components/util/FocusAwareStatusBar";
import NewReading from "../components/CreateReading/NewReading";

export type CreateReadingProps = NativeStackScreenProps<RootStackParamList>;

export default function CreateReading({ navigation }: CreateReadingProps) {
  return (
    <>
      <FocusAwareStatusBar style="dark" />
      <NewReading onConfirm={() => navigation.navigate("Tabs")} />
    </>
  );
}

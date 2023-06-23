import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import FocusAwareStatusBar from "../components/util/FocusAwareStatusBar";

export type CreateReadingProps = NativeStackScreenProps<RootStackParamList>;

export default function CreateReading({}: CreateReadingProps) {
  return (
    <>
      <FocusAwareStatusBar style="dark" />
    </>
  );
}

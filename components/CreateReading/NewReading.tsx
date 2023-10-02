import { CameraCapturedPicture } from "expo-camera";
import { useState } from "react";
import Snap from "./Snap";
import InputReading from "./InputReading";
import Confirmation from "./Confirmation";

export type NewReadingProps = {
  onConfirm: (snapshot: CameraCapturedPicture | null, reading: number) => void;
};

export default function NewReading({ onConfirm }: NewReadingProps) {
  const [snapshot, setSnapshot] = useState<CameraCapturedPicture | null>();
  const [reading, setReading] = useState<number | null>(null);

  if (snapshot === undefined) {
    return <Snap onSnapshot={setSnapshot} onSkip={() => setSnapshot(null)} />;
  }

  if (reading == null) {
    return (
      <InputReading
        snapshot={snapshot}
        onReturn={() => setSnapshot(null)}
        onConfirm={setReading}
      />
    );
  }

  return (
    <Confirmation
      snapshot={snapshot}
      reading={reading}
      onReturn={() => setReading(null)}
      onConfirm={() => onConfirm(snapshot, reading)}
    />
  );
}

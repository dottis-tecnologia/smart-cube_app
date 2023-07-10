import trpc from "../trpc";
import { isAfter, isBefore } from "date-fns";
import { dbQuery } from "../db";
import uploadFile from "../uploadFile";
import * as FileSystem from "expo-file-system";

type Reading = {
  id: string;
  meterId: string;
  value: string;
  technician: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
};
export const syncReading = async (reading: Reading, lastSync?: Date) => {
  const createdAt = new Date(reading.createdAt);
  if (lastSync == null || isAfter(createdAt, lastSync)) {
    await dbQuery(
      "INSERT INTO readings (id, meterId, value, createdAt, synchedAt, technicianName) VALUES (?, ?, ?, ?, ?, ?)",
      [
        reading.id,
        reading.meterId,
        +reading.value,
        new Date(reading.createdAt).toISOString(),
        new Date().toISOString(),
        reading.technician?.name,
      ],
      false
    );
  } else {
    await dbQuery(
      "UPDATE readings SET value = ?, synchedAt = ? WHERE id = ?",
      [reading.value, new Date().toISOString(), reading.id],
      false
    );
  }
};

type ReadingPayload = {
  id: string;
  meterId: string;
  value: number;
  createdAt: string;
  imagePath: string;
};
export const sendReading = async (payload: ReadingPayload) => {
  const { outUrl } = await uploadFile(payload.imagePath, "image/jpg", {
    dimensions: { height: 300, width: 300 },
  });

  console.log(outUrl);
  const data = await trpc.readings.create.mutate({
    ...payload,
    createdAt: new Date(payload.createdAt),
    imagePath: outUrl,
  });

  await dbQuery(
    "UPDATE readings SET synchedAt = ?, imagePath = ? WHERE id = ?",
    [data.createdAt, outUrl, payload.id],
    false
  );

  FileSystem.deleteAsync(payload.imagePath);
};

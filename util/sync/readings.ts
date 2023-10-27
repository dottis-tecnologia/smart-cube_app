import trpc from "../trpc";
import { isAfter, isBefore } from "date-fns";
import { dbQuery } from "../db";
import uploadFile from "../uploadFile";
import * as FileSystem from "expo-file-system";

type Reading<T> = {
  id: string;
  meterId: string;
  value: T;
  imagePath: string | null;
  technician: { id: string; name: string } | null;
  createdAt: Date;
  updatedAt: Date;
};
export const syncReading = async <T>(reading: Reading<T>, lastSync?: Date) => {
  const createdAt = new Date(reading.createdAt);
  if (lastSync == null || isAfter(createdAt, lastSync)) {
    await dbQuery(
      "INSERT OR IGNORE INTO readings (id, meterId, value, createdAt, imagePath, synchedAt, technicianId, technicianName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        reading.id,
        reading.meterId,
        +reading.value,
        reading.createdAt.toISOString(),
        reading.imagePath,
        new Date().toISOString(),
        reading.technician?.id,
        reading.technician?.name,
      ],
      false
    );
  } else {
    await dbQuery(
      "UPDATE readings SET value = ?, synchedAt = ? WHERE id = ?",
      [+reading.value, new Date().toISOString(), reading.id],
      false
    );
  }
};

type ReadingPayload = {
  id: string;
  meterId: string;
  value: number;
  createdAt: string;
  imagePath: string | null;
};
export const sendReading = async (payload: ReadingPayload) => {
  if (payload.imagePath != null) {
    const { outUrl } = await uploadFile(payload.imagePath, "image/jpg", {
      dimensions: { height: 300, width: 300 },
    });

    const data = await trpc.readings.create.mutate({
      ...payload,
      createdAt: new Date(payload.createdAt),
      imagePath: outUrl,
    });

    await dbQuery(
      "UPDATE readings SET synchedAt = ?, imagePath = ? WHERE id = ?",
      [data.createdAt.toISOString(), outUrl, payload.id],
      false
    );

    FileSystem.deleteAsync(payload.imagePath);
  } else {
    const data = await trpc.readings.create.mutate({
      ...payload,
      createdAt: new Date(payload.createdAt),
      imagePath: null,
    });

    await dbQuery(
      "UPDATE readings SET synchedAt = ? WHERE id = ?",
      [data.createdAt.toISOString(), payload.id],
      false
    );
  }
};

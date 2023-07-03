import AsyncStorage from "@react-native-async-storage/async-storage";
import trpc from "../trpc";
import { isBefore } from "date-fns";
import { dbQuery } from "../db";

type Reading = {
  id: string;
  meterId: string;
  value: number;
  createdAt: string;
  updatedAt: string;
};
export const syncReading = async (reading: Reading, lastSync?: Date) => {
  const createdAt = new Date(reading.createdAt);
  if (lastSync == null || isBefore(createdAt, lastSync)) {
    await dbQuery(
      "INSERT OR IGNORE INTO readings (id, meterId, value, createdAt, synchedAt) VALUES (?, ?, ?, ?, ?)",
      [
        reading.id,
        reading.meterId,
        reading.value,
        new Date(reading.createdAt).toISOString(),
        new Date().toISOString(),
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
  synchedAt?: string;
};
export const sendReading = async (payload: ReadingPayload) => {
  const mutation = await trpc.readings.create.mutate({
    ...payload,
    createdAt: new Date(payload.createdAt),
  });

  await dbQuery(
    "UPDATE readings SET synchedAt = ? WHERE id = ?",
    [mutation.createdAt, payload.id],
    false
  );
};

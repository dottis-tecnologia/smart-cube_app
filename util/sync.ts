import AsyncStorage from "@react-native-async-storage/async-storage";
import trpc from "./trpc";
import { isBefore } from "date-fns";
import { dbQuery } from "./db";

export type Meter = {
  id: string;
  location: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
};
const syncMeter = async (meter: Meter, lastSync?: Date) => {
  const createdAt = new Date(meter.createdAt);
  if (lastSync == null || isBefore(createdAt, lastSync)) {
    await dbQuery(
      "INSERT INTO meters (id, location, unit, synchedAt) VALUES (?, ?, ?, ?)",
      [meter.id, meter.location, meter.unit, new Date().toISOString()],
      false
    );
  } else {
    await dbQuery(
      "UPDATE meters SET location = ?, unit = ?, synchedAt = ? WHERE id = ?",
      [meter.location, meter.unit, new Date().toISOString(), meter.id],
      false
    );
  }
};

export const syncMeters = async () => {
  const lastSyncRaw = await AsyncStorage.getItem("last-sync");

  let lastSync: Date | undefined;
  if (lastSyncRaw != null) {
    lastSync = new Date(lastSyncRaw);
  }

  const meters = await trpc.meters.sync.query(lastSync);
  console.log(meters);
  for (const meter of meters) {
    await syncMeter(meter, lastSync);
  }

  await AsyncStorage.setItem("last-sync", new Date().toISOString());
};

type Reading = {
  id: string;
  meterId: string;
  value: number;
  createdAt: string;
  synchedAt?: string;
};
export const sendReading = async (reading: Reading) => {
  await trpc.readings.create.mutate({
    ...reading,
    createdAt: new Date(reading.createdAt),
  });
  await dbQuery(
    "UPDATE readings SET synchedAt = ? WHERE id = ?",
    [new Date().toISOString(), reading.id],
    false
  );
};

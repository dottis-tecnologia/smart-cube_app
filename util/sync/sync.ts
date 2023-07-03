import AsyncStorage from "@react-native-async-storage/async-storage";
import trpc from "../trpc";
import { syncMeter } from "./meters";
import { sendReading, syncReading } from "./readings";
import { dbQuery } from "../db";

export const syncData = async () => {
  const lastSyncRaw = await AsyncStorage.getItem("last-sync");

  let lastSync: Date | undefined;
  if (lastSyncRaw != null) {
    lastSync = new Date(lastSyncRaw);
  }

  const meters = await trpc.meters.sync.query(lastSync);
  for (const meter of meters) {
    await syncMeter(meter, lastSync);
  }

  const readings = await trpc.readings.sync.query(lastSync);
  for (const reading of readings) {
    await syncReading(reading, lastSync);
  }

  const unsentReadings = await dbQuery<{
    id: string;
    meterId: string;
    value: number;
    createdAt: string;
  }>("SELECT * FROM readings WHERE readings.synchedAt IS NULL;");

  if (unsentReadings == null) throw new Error("Error while getting readings");

  for (const reading of unsentReadings?.rows) {
    await sendReading(reading);
  }

  await AsyncStorage.setItem("last-sync", new Date().toISOString());
};

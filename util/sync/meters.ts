import AsyncStorage from "@react-native-async-storage/async-storage";
import trpc from "../trpc";
import { isBefore } from "date-fns";
import { dbQuery } from "../db";

export type Meter = {
  id: string;
  location: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
};
export const syncMeter = async (meter: Meter, lastSync?: Date) => {
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

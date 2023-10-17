import trpc from "../trpc";
import * as FileSystem from "expo-file-system";
import { isAfter } from "date-fns";
import { dbQuery } from "../db";

export type Meter = {
  id: string;
  imagePath: string | null;
  location: string;
  unit: string;
  name: string;
  notes: string | null;
  energyName: string | null;
  createdAt: string;
  updatedAt: string;
};
export const syncMeter = async (meter: Meter, lastSync?: Date) => {
  const createdAt = new Date(meter.createdAt);

  if (lastSync == null || isAfter(createdAt, lastSync)) {
    await dbQuery(
      "INSERT INTO meters (id, name, location, unit, synchedAt, notes, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        meter.id,
        meter.name,
        meter.location || "-",
        meter.unit,
        new Date().toISOString(),
        meter.notes || "",
        meter.energyName || "",
      ],
      false
    );
  } else {
    await dbQuery(
      "UPDATE meters SET name = ?, location = ?, unit = ?, synchedAt = ?, notes = ?, type = ? WHERE id = ?",
      [
        meter.name,
        meter.location || "-",
        meter.unit,
        new Date().toISOString(),
        meter.notes || "",
        meter.energyName || "",
        meter.id,
      ],
      false
    );
  }

  const imagePath = await tryAndDownloadImage(meter);
  if (imagePath) {
    await dbQuery(
      "UPDATE meters SET imagePath = ? WHERE id = ?",
      [imagePath, meter.id],
      false
    );
  }
};

async function tryAndDownloadImage(meter: Meter) {
  const folder = `${FileSystem.documentDirectory}pictures/${meter.id}`;
  if (!(await FileSystem.getInfoAsync(folder)).exists) {
    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
  }

  if (meter.imagePath == null) return null;

  const imageUrl = meter.imagePath.split("?")[0];
  const extSplit = imageUrl.split(".");
  const ext = extSplit[extSplit.length - 1];
  const filePath = `${folder}/image.${ext}`;

  try {
    await FileSystem.downloadAsync(meter.imagePath, filePath);
    return filePath;
  } catch (e) {
    console.error(e);
    return null;
  }
}

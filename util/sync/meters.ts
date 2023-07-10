import trpc from "../trpc";
import * as FileSystem from "expo-file-system";
import { isAfter } from "date-fns";
import { dbQuery } from "../db";

export type Meter = {
  id: string;
  location: string;
  unit: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
export const syncMeter = async (meter: Meter, lastSync?: Date) => {
  const createdAt = new Date(meter.createdAt);

  if (lastSync == null || isAfter(createdAt, lastSync)) {
    await dbQuery(
      "INSERT INTO meters (id, name, location, unit, synchedAt) VALUES (?, ?, ?, ?, ?)",
      [
        meter.id,
        meter.name,
        meter.location,
        meter.unit,
        new Date().toISOString(),
      ],
      false
    );
  } else {
    await dbQuery(
      "UPDATE meters SET name = ?, location = ?, unit = ?, synchedAt = ? WHERE id = ?",
      [
        meter.name,
        meter.location,
        meter.unit,
        new Date().toISOString(),
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

  const image = await trpc.meters.image.query(meter.id);
  if (image == null) return null;

  const imageUrl = image.split("?")[0];
  const extSplit = imageUrl.split(".");
  const ext = extSplit[extSplit.length - 1];
  const filePath = `${folder}/image.${ext}`;
  await FileSystem.downloadAsync(image, filePath);

  return filePath;
}

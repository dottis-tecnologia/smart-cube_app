import { apiUrl } from "../config";
import { getToken } from "./authToken";

export default async function uploadFile(
  localPath: string,
  mimeType: string,
  options: { dimensions?: { width: number; height: number } }
) {
  const pathName = localPath.split("?")[0];
  const splitPath = pathName.split("/");
  const fileName = splitPath[splitPath.length - 1];

  const formData = new FormData();
  formData.append("file", {
    uri: localPath,
    type: mimeType,
    name: fileName,
  } as any);

  formData.append("width", (options?.dimensions?.width || 500).toString());
  formData.append("height", (options?.dimensions?.height || 500).toString());

  const resp = await fetch(new URL("/images", apiUrl), {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!resp.ok) throw new Error("Unexpected error while uploading file");

  return (await resp.json()) as {
    outUrl: string;
    width: number;
    height: number;
  };
}

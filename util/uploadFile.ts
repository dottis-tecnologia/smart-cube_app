import trpc from "./trpc";

export default async function (localPath: string, targetPath: string) {
  const pathName = localPath.split("?")[0];
  const splitPath = pathName.split("/");
  const fileName = splitPath[splitPath.length - 1];
  const filePath = `${targetPath}/${fileName}`;

  const { uploadUrl, targetPath: resultPath } = await trpc.uploadUrl.query({
    filePath,
  });

  const resp = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: {
      uri: localPath,
      name: fileName,
    } as any,
  });

  if (!resp.ok) throw new Error("Unexpected error while uploading file");

  return resultPath;
}

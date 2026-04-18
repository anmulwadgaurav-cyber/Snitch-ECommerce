import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
  publicKey: config.IMAGEKIT_PUBLIC_KEY, // This is the default and can be omitted
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT, // This is the default and can be omitted
});

export async function uploadFile({ buffer, fileName, folder = "snitch" }) {
  const base64 = buffer.toString("base64");
  try {
    const result = await client.files.upload({
      file: base64,
      fileName: fileName,
      folder: folder,
    });
    console.log("ImageKit Upload Result:", result);
    return result;
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw error;
  }
}

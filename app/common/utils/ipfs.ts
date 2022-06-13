import { Web3Storage } from "web3.storage";

/**
 * Stores an image file on Web3.Storage, along with a small metadata.json that includes a caption & filename.
 * @param {File} imageFile a File object containing image data
 * @param {string} caption a string that describes the image
 *
 * @typedef StoreImageResult
 * @property {string} cid the Content ID for an directory containing the image and metadata
 * @property {string} imageURI an ipfs:// URI for the image file
 * @property {string} metadataURI an ipfs:// URI for the metadata file
 * @property {string} imageGatewayURL an HTTP gateway URL for the image
 * @property {string} metadataGatewayURL an HTTP gateway URL for the metadata file
 *
 * @returns {Promise<StoreImageResult>} an object containing links to the uploaded content
 */

const namePrefix = "ImageGallery";

export async function storeImage(imageFile: File, caption: string) {
  // The name for our upload includes a prefix we can use to identify our files later
  const uploadName = [namePrefix, caption].join("|");

  // We store some metadata about the image alongside the image file.
  // The metadata includes the file path, which we can use to generate
  // a URL to the full image.
  const metadataFile = jsonFile("metadata.json", {
    path: imageFile.name,
    caption,
  });

  const token = process.env.WEB3_STORAGE_TOKEN as string;
  const web3storage = new Web3Storage({ token });
  //   showMessage(`> 🤖 calculating content ID for ${imageFile.name}`);
  const cid = await web3storage.put([imageFile, metadataFile], {
    // the name is viewable at https://web3.storage/files and is included in the status and list API responses
    name: uploadName,
  });

  const metadataGatewayURL = makeGatewayURL(cid, "metadata.json");
  const imageGatewayURL = makeGatewayURL(cid, imageFile.name);
  const imageURI = `ipfs://${cid}/${imageFile.name}`;
  const metadataURI = `ipfs://${cid}/metadata.json`;
  return { cid, metadataGatewayURL, imageGatewayURL, imageURI, metadataURI };
}

/**
 * Return an IPFS gateway URL for the given CID and path
 * @param {string} cid
 * @param {string} path
 * @returns {string}
 */
export function makeGatewayURL(cid: string, path: string) {
  return `https://${cid}.ipfs.dweb.link/${encodeURIComponent(path)}`;
}

/**
 * Make a File object with the given filename, containing the given object (serialized to JSON).
 * @param {string} filename filename for the returned File object
 * @param {object} obj a JSON-serializable object
 * @returns {File}
 */
export function jsonFile(filename: string, obj: any) {
  return new File([JSON.stringify(obj)], filename);
}

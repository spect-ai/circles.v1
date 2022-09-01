import { Web3Storage } from "web3.storage";
import { create } from "ipfs-http-client";
const namePrefix = "Spect";

export async function storeImage(imageFile: File, caption: string) {
  const projectId = "2E6toVcDcGO87J2tX6GHK4aBILR";
  const projectSecret = "9f96144517b0a20eef70c46239ab0ad7";
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  const res = await client.add(imageFile);

  return { imageGatewayURL: `https://spect.infura-ipfs.io/ipfs/${res.cid}` };
  // const uploadName = [namePrefix, caption].join("|");

  // const metadataFile = jsonFile("metadata.json", {
  //   path: imageFile.name,
  //   caption,
  // });

  // const token = process.env.WEB3_STORAGE_TOKEN as string;
  // const web3storage = new Web3Storage({ token });
  // const cid = await web3storage.put([imageFile, metadataFile], {
  //   name: uploadName,
  // });

  // const metadataGatewayURL = makeGatewayURL(cid, "metadata.json");
  // const imageGatewayURL = `https://${cid}.ipfs.w3s.link/${imageFile.name}`;
  // const imageURI = `ipfs://${cid}/${imageFile.name}`;
  // const metadataURI = `ipfs://${cid}/metadata.json`;
  // console.log({ metadataGatewayURL });
  // return { cid, metadataGatewayURL, imageGatewayURL, imageURI, metadataURI };
}

export function makeGatewayURL(cid: string, path: string) {
  return `https://${cid}.ipfs.dweb.link/${encodeURIComponent(path)}`;
}

export function jsonFile(filename: string, obj: any) {
  return new File([JSON.stringify(obj)], filename);
}

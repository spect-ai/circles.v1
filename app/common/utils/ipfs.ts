import { create } from "ipfs-http-client";

export async function storeImage(imageFile: File) {
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
}

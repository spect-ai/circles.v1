import ImageKit from "imagekit-javascript";
// SDK initialization

var imagekit = new ImageKit({
  publicKey: "public_CqD2Qv50op/DuvGfKx9tDIDqNTc=",
  urlEndpoint: "https://ik.imagekit.io/spectcdn",
  authenticationEndpoint: "https://circles.spect.network/api/authImageKit",
});

export async function storeImage(imageFile: File) {
  const randomId = Math.random().toString(36).substring(2, 15);
  const res = await imagekit.upload({
    file: imageFile,
    fileName: imageFile.name + randomId,
  });
  console.log({ res });
  return { imageGatewayURL: res.url };
}

import ImageKit from "imagekit-javascript";
// SDK initialization

var imagekit = new ImageKit({
  publicKey: "public_CqD2Qv50op/DuvGfKx9tDIDqNTc=",
  urlEndpoint: "https://ik.imagekit.io/spectcdn",
  authenticationEndpoint: "https://circles.spect.network/api/authImageKit",
});

// URL generation

// Upload function internally uses the ImageKit.io javascript SDK
// function upload(data) {
//   var file = document.getElementById("file1");
//   imagekit.upload({
//       file : file.files[0],
//       fileName : "abc1.jpg",
//       tags : ["tag1"]
//   }, function(err, result) {
//       console.log(arguments);
//       console.log(imagekit.url({
//           src: result.url,
//           transformation : [{ height: 300, width: 400}]
//       }));
//   })
// }

export async function storeImage(imageFile: File) {
  // const projectId = "2E6toVcDcGO87J2tX6GHK4aBILR";
  // const projectSecret = "9f96144517b0a20eef70c46239ab0ad7";
  // const auth =
  //   "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  // const client = create({
  //   host: "ipfs.infura.io",
  //   port: 5001,
  //   protocol: "https",
  //   headers: {
  //     authorization: auth,
  //   },
  // });

  // const res = await client.add(imageFile);

  // return { imageGatewayURL: `https://spect.infura-ipfs.io/ipfs/${res.cid}` };

  const res = await imagekit.upload({
    file: imageFile,
    fileName: imageFile.name,
  });
  console.log({ res });
  return { imageGatewayURL: res.url };
}

// auth image kit
import { NextApiRequest, NextApiResponse } from "next";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: "public_CqD2Qv50op/DuvGfKx9tDIDqNTc=",
  urlEndpoint: "https://ik.imagekit.io/spectcdn",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("auth image kit");
  try {
    const signatureObj = imagekit.getAuthenticationParameters(
      req.query.token as string,
      parseInt(req.query.expire as string)
    );

    res.status(200).send(signatureObj);
  } catch (err) {
    console.error(
      "Error while responding to auth request:",
      JSON.stringify(err, undefined, 2)
    );
    res.status(500).send("Internal Server Error");
  }
};

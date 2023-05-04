import { ImageResponse } from "@vercel/og";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: "experimental-edge",
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url || "");
  const cover = searchParams.get("cover");
  const logo = searchParams.get("logo");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "ActiveBorder",
        }}
      >
        <img
          src={
            cover ||
            "https://ik.imagekit.io/spectcdn/Banner_Dark_Hbmk5Dh39s.png?updatedAt=1681477965494"
          }
          style={{
            objectFit: "cover",
            height: "100%",
            width: "100%",
          }}
        />
        <img
          src={
            logo ||
            "https://ik.imagekit.io/spectcdn/spectcircular_ZAOFs2MOF.png?updatedAt=1681481735869"
          }
          style={{
            width: 150,
            height: 150,
            borderRadius: 150,
            marginBottom: -75,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );
}

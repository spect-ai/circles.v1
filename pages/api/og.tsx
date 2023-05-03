import { ImageResponse } from "@vercel/og";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: "experimental-edge",
};

export default function (req: NextApiRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url || "");
  const chartName = searchParams.get("chartName");
  const chartType = searchParams.get("chartType");
  console.log({ chartName, chartType });
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 78,
          width: "100%",
          height: "100%",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(to top right, rgb(191, 90, 242), rgb(109,0,255))`,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {`${chartName} ${chartType} chart`}
        <img
          src="https://ik.imagekit.io/spectcdn/transparent-spect.png?updatedAt=1683120570449"
          style={{
            width: 150,
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

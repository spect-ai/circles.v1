import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { guild_id, state: cId } = req.query;
  console.log({ guild_id, cId });
  res.redirect(`/${cId}?guild_id=${guild_id}`);
}

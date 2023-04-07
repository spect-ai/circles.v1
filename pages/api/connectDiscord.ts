import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { guild_id, state: cId } = req.query;
  res.redirect(`/${cId}?guild_id=${guild_id}`);
}

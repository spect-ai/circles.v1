// create a nextjs api to verufy gogle captcha token
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.body;
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await fetch(url, {
      method: "POST",
    });
    const data = await response.json();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
};

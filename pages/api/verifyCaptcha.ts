// create a nextjs api to verufy gogle captcha token
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.body;
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await axios.post(url);
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
};

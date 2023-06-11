import { logError } from "@/app/common/utils/utils";
import { StampWithScoreAndVerification } from "@/app/types";

export const getAllCredentials = async () => {
  return await (await fetch(`${process.env.API_HOST}/credentials/v1/`)).json();
};

export const getPassportScoreAndStamps = async (
  formSlug: string
): Promise<{
  stamps: StampWithScoreAndVerification[];
  score: number;
}> => {
  const res = await fetch(
    `${process.env.API_HOST}/collection/v2/form/slug/${formSlug}/gitcoinPassportScoreAndStamps`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (res.status === 404) {
    logError(`Error fetching passport score and stamps: Not found`);
    throw new Error("Not found");
  }
  const data = await res.json();
  if (!res.ok) {
    logError(`Error fetching passport score and stamps: ${data.message}`);
    throw new Error(data.message);
  }
  return data;
};

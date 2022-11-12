import { GitcoinScoreType } from "@/app/types";
import { PassportReader } from "@gitcoinco/passport-sdk-reader";
// import { PassportScorer } from "@gitcoinco/passport-sdk-scorer";
// create a new instance pointing at Gitcoins mainnet Ceramic node
const reader = new PassportReader(
  "https://ceramic.passport-iam.gitcoin.co",
  "1"
);

export const getPassport = async (ethAddress: string) => {
  console.log(reader);
  return await reader.getPassport(ethAddress);
};

export const getAllCredentials = async () => {
  return await (await fetch(`${process.env.API_HOST}/credentials/v1/`)).json();
};

export const getCredentialsByAddressAndIssuer = async (
  address: string,
  issuer: string
) => {
  console.log({ address, issuer });
  return await (
    await fetch(
      `${process.env.API_HOST}/credentials/v1/credentialsByAddressAndIssuer?ethAddress=${address}&issuer=${issuer}`
    )
  ).json();
};

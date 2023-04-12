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

export const getPassportScoreAndCredentials = async (
  address: string,
  scores: any
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/credentials/v1/${address}/passportScoreAndStamps`,
      {
        method: "POST",
        body: JSON.stringify({ scores }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  ).json();
};

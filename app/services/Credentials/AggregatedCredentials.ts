export const getAllCredentials = async () =>
  (await fetch(`${process.env.API_HOST}/credentials/v1/`)).json();

export const getCredentialsByAddressAndIssuer = async (
  address: string,
  issuer: string
) =>
  (
    await fetch(
      `${process.env.API_HOST}/credentials/v1/credentialsByAddressAndIssuer?ethAddress=${address}&issuer=${issuer}`
    )
  ).json();

export const getPassportScoreAndCredentials = async (
  address: string,
  scores: unknown
) =>
  (
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

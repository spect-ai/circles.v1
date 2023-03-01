export const getPredictedGas = async (chainId: string) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/common/gasPrediction?chainId=${chainId}`
    )
  ).json();
};

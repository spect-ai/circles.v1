const getPredictedGas = async (chainId: string) =>
  (
    await fetch(
      `${process.env.API_HOST}/common/gasPrediction?chainId=${chainId}`
    )
  ).json();

export default getPredictedGas;

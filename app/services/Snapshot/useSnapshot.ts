import snapshot from "@snapshot-labs/snapshot.js";
import { ethers } from "ethers";
import { useLocalCollection } from "@/app/modules/Collection/Context/LocalCollectionContext";
import { useLocation } from "react-use";
import { useBlockNumber, useAccount, useProvider } from "wagmi";

interface createProposalDto {
  title: string;
  body: string;
  start: number;
  end: number;
  block?: number;
}

export default function useSnapshot() {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { hostname } = useLocation();
  const { address } = useAccount();
  // const provider = useProvider();

  const hub = hostname?.startsWith("circles")
    ? "https://hub.snapshot.org"
    : "https://testnet.snapshot.org";

  const client = new snapshot.Client712(hub);

  const space = collection?.voting?.snapshot?.id || "";
  const { refetch: refetchBlockNumber } = useBlockNumber({
    chainId: Number(collection?.voting?.snapshot?.network) || 1,
  });

  async function createProposal({
    title,
    body,
    start,
    end,
    block,
  }: createProposalDto) {
    try {
      const window: any = globalThis;
      const provider = new ethers.providers.Web3Provider(window?.ethereum);
      const blockNumber = await refetchBlockNumber();

      const receipt = await client.proposal(
        provider as any,
        address as string,
        {
          space,
          type: "single-choice",
          title: title,
          body: body,
          choices: collection?.voting?.options?.map((option) => option.label),
          start: start || Math.floor(new Date().getTime() / 1000),
          end: end || Math.floor((new Date().getTime() + 7200000) / 1000),
          snapshot: (blockNumber?.data as number) - 1,
          network: "5",
          plugins: JSON.stringify({}),
          app: "Spect",
        } as any
      );

      console.log(receipt);
      return receipt;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function castVote(proposal: string, choice: number) {
    try {
      const window: any = globalThis;
      const provider = new ethers.providers.Web3Provider(window?.ethereum);

      const receipt = await client.vote(provider, address as string, {
        space,
        proposal: proposal,
        type: "single-choice",
        choice: choice,
        app: "Spect",
      });

      console.log(receipt);
      return receipt;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function calculateScores(voters: string[], blockNumber: number) {
    const strategies = [
      {
        name: "erc20-balance-of",
        params: {
          address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
          symbol: "LINK",
          decimals: 18,
        },
      },
    ] as any;
    const network = collection?.voting?.snapshot?.network || "5";

    snapshot.utils
      .getScores(space, strategies, network, voters, blockNumber)
      .then((scores) => {
        console.log("Scores", scores);
        return scores;
      });
  }

  return { createProposal, castVote, calculateScores };
}

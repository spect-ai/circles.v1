import snapshot from "@snapshot-labs/snapshot.js";
import { ethers } from "ethers";
import { useLocalCollection } from "@/app/modules/Collection/Context/LocalCollectionContext";
import { useLocation } from "react-use";
import { useBlockNumber, useAccount, useProvider } from "wagmi";
import { useCircle } from "@/app/modules/Circle/CircleContext";

interface createProposalDto {
  title: string;
  body: string;
  start?: number;
  end?: number;
  choices?: string[];
}

export default function useSnapshot() {
  const { circle } = useCircle();
  const { hostname } = useLocation();
  const { address } = useAccount();

  const hub = hostname?.startsWith("circles")
    ? "https://hub.snapshot.org"
    : "https://testnet.snapshot.org";

  const client = new snapshot.Client712(hub);

  const space = circle?.snapshot?.id || "";
  const { refetch: refetchBlockNumber } = useBlockNumber({
    chainId: Number(circle?.snapshot?.network) || 1,
  });

  async function createProposal({
    title,
    body,
    start,
    end,
    choices,
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
          choices: choices || ["Yes", "No"],
          start: start || Math.floor(new Date().getTime() / 1000),
          end:
            end ||
            Math.floor(
              (new Date().getTime() +
                (hostname?.startsWith("circles") ? 604800000 : 7200000)) /
                1000
            ),
          snapshot: (blockNumber?.data as number) - 1,
          network: circle?.snapshot?.network,
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

  return { createProposal, castVote };
}

import snapshot from "@snapshot-labs/snapshot.js";
// eslint-disable-next-line import/no-extraneous-dependencies
import { getProvider } from "@wagmi/core";
import { useLocation } from "react-use";
import { useBlockNumber, useAccount } from "wagmi";
import { useCircle } from "@/app/modules/Circle/CircleContext";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Web3Provider } from "@ethersproject/providers";

interface CreateProposalDto {
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
  }: CreateProposalDto) {
    try {
      const provider: unknown = await getProvider();
      const blockNumber = await refetchBlockNumber();

      const receipt = await client.proposal(
        provider as Web3Provider,
        address as string,
        {
          space,
          type: "single-choice",
          title,
          body,
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
          plugins: JSON.stringify({}),
          app: "Spect",
          discussion: "",
        }
      );

      return receipt;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async function castVote(proposal: string, choice: number) {
    try {
      const provider: unknown = await getProvider();
      const receipt = await client.vote(
        provider as Web3Provider,
        address as string,
        {
          space,
          proposal,
          type: "single-choice",
          choice,
          app: "Spect",
        }
      );

      return receipt;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  return { createProposal, castVote };
}

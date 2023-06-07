import { AlchemyNftContract, NFTFromAlchemy } from "@/app/types";
import { Signer, fetchSigner, getContract } from "@wagmi/core";

export const ERC165Abi: any = [
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const ERC1155InterfaceId = "0xd9b67a26";
export const ERC721InterfaceId = "0x80ac58cd";

export const isERC1155 = async (address: string) => {
  const signer = await fetchSigner();
  const contract = getContract({
    address,
    abi: ERC165Abi,
    signerOrProvider: signer as unknown as Signer,
  });
  console.log({ contract });
  return await contract.supportsInterface(ERC1155InterfaceId);
};

export const getContractMetdata = async (
  chainId: string,
  contractAddress: string
): Promise<AlchemyNftContract> => {
  const res = await fetch(
    `${process.env.API_HOST}/common/nft/contractMetadata?chainId=${chainId}&contractAddress=${contractAddress}`
  );
  if (!res?.ok) throw new Error("Error fetching contract metadata");
  return await res.json();
};

export const getTokenMetadata = async (
  chainId: string,
  contractAddress: string,
  tokenId: number | string
): Promise<NFTFromAlchemy> => {
  const res = await fetch(
    `${process.env.API_HOST}/common/nft/metadata?chainId=${chainId}&contractAddress=${contractAddress}&tokenId=${tokenId}`
  );

  if (!res?.ok) throw new Error("Error fetching token metadata");
  return await res.json();
};

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

export const getTokenMetadata = async (
  chainId: string,
  contractAddress: string,
  tokenId?: number | string
) => {
  const tokenIdQuery = tokenId ? `&tokenId=${tokenId}` : "";
  const res = await fetch(
    `${process.env.API_HOST}/common/tokenMetadata?chainId=${chainId}&contractAddress=${contractAddress}${tokenIdQuery}`
  );
  return await res.json();
};

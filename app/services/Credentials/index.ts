import { kudosTypes } from "@/app/common/utils/constants";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { useLocalCollection } from "@/app/modules/Collection/Context/LocalCollectionContext";
import { KudosRequestType, MappedItem } from "@/app/types";
import { useTheme } from "degen";
import { toast } from "react-toastify";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { signTypedData } from "@wagmi/core";

const chainId = "137";
const domainInfo = {
  name: "Kudos",
  chainId,
  verifyingContract:
    "0x60576A64851C5B42e8c57E3E4A5cF3CF4eEb2ED6" as `0x${string}`,
};

export default function useCredentials() {
  const { registry, circle } = useCircle();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();
  const { mode } = useTheme();

  const mintKudos = async (
    kudos: KudosRequestType,
    communityId: string,
    issuingCommunity: string,
    nftTypeId?: File
  ) => {
    const value = {
      ...kudos,
      headline: kudos.headline,
      description: kudos.description?.substring(0, 999) || "",
      communityUniqId: communityId,
      startDateTimestamp: kudos.startDateTimestamp || 0,
      endDateTimestamp: kudos.endDateTimestamp || 0,
      expirationTimestamp: kudos.expirationTimestamp || 0,
      isSignatureRequired: kudos.isSignatureRequired,
      isAllowlistRequired: kudos.isAllowlistRequired,
      links: kudos.links || [],
      totalClaimCount: kudos.totalClaimCount || 0,
      customAttributes: [
        {
          fieldName: "Issuing Community",
          type: "string",
          value: `${issuingCommunity}`,
        },
      ],
    };
    if (registry) {
      try {
        if (chain?.id.toString() !== chainId) {
          switchNetworkAsync && (await switchNetworkAsync(parseInt(chainId)));
        }
        // Obtain signature
        const signature: string = await signTypedData({
          domain: domainInfo,
          types: kudosTypes,
          value,
        });
        const params = {
          creator: kudos.creator,
          headline: value.headline,
          description: value.description,
          startDateTimestamp: value.startDateTimestamp,
          endDateTimestamp: value.endDateTimestamp,
          expirationTimestamp: value.expirationTimestamp,
          links: value.links,
          isSignatureRequired: value.isSignatureRequired,
          isAllowlistRequired: value.isAllowlistRequired,
          communityId,
          nftTypeId: nftTypeId || "defaultOrangeRed",
          contributors: kudos.contributors,
          customAttributes: value.customAttributes,
          signature,
        } as KudosRequestType;
        if (kudos.totalClaimCount) {
          params.totalClaimCount = value.totalClaimCount;
        }

        const body = JSON.stringify(params);
        toast(
          "Creating Kudos takes a few seconds. You'll be notified once its successful.",
          {
            theme: mode,
          }
        );
        const res = await fetch(
          `${process.env.API_HOST}/circle/v1/${circle?.id}/mintKudos`,
          {
            credentials: "include",
            method: "PATCH",
            body,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          return data;
        }
        toast.error("Error creating kudos", {
          theme: mode,
        });
        return false;
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.name === "ConnectorNotFoundError") {
            toast.error(
              "Please login to your wallet and connect it to Spect, wallet might be locked"
            );
            return false;
          }
          toast.error(error.message);
        }
        console.warn({ error });
        return false;
      }
    }

    return null;
  };

  const recordCollectionKudos = (
    operationId: string,
    minimumNumberOfAnswersThatNeedToMatch: number,
    responseData: MappedItem<unknown>,
    numOfKudos?: number
  ) => {
    const intervalPromise = setInterval(() => {
      fetch(`${process.env.MINTKUDOS_HOST}${operationId}`)
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            if (data.status === "success") {
              clearInterval(intervalPromise);
              fetch(`${process.env.API_HOST}/collection/v1/${collection.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                  formMetadata: {
                    ...(collection.formMetadata || {}),
                    mintkudosTokenId: data.resourceId,
                    numOfKudos: numOfKudos || 10000,
                    minimumNumberOfAnswersThatNeedToMatchForMintkudos:
                      minimumNumberOfAnswersThatNeedToMatch,
                    responseDataForMintkudos: responseData,
                    walletConnectionRequired: true,
                  },
                }),
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              })
                .then((newRes) => {
                  if (newRes.ok) {
                    newRes
                      .json()
                      .then((res2) => {
                        // Only update state if user is on same card
                        if (collection.slug === res2.slug) {
                          setLocalCollection(res2);
                        }
                      })
                      .catch((err) => console.error(err));
                    toast.success("Successfully created kudos!", {
                      theme: mode,
                    });
                  } else {
                    toast.error("Something went wrong, refresh and try again!");
                  }
                })
                .catch((err) => console.error(err));
            }
          }
        })
        .catch((err) => console.error(err));
    }, 1000);
    setTimeout(() => {
      clearInterval(intervalPromise);
    }, 120000);
  };

  const claimKudos = async (tokenId: number, claimingAddress: string) => {
    const value = {
      tokenId, // mandatory
    };
    if (registry) {
      try {
        if (chain?.id.toString() !== chainId) {
          switchNetworkAsync && (await switchNetworkAsync(parseInt(chainId)));
        }
        const signature: string = await signTypedData({
          domain: domainInfo,
          types: kudosTypes,
          value,
        });

        toast("Claiming Kudos...", {
          theme: mode,
        });
        const res = await fetch(
          `${process.env.API_HOST}/circle/v1/${circle?.id}/claimKudos`,
          {
            credentials: "include",
            method: "PATCH",
            body: JSON.stringify({
              claimingAddress,
              signature,
              tokenId,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        console.error(error);
        return false;
      }
    }
    return null;
  };

  const getKudosOfUser = async (ethAddress: string) => {
    const res = await fetch(
      `${process.env.MINTKUDOS_HOST}/v1/wallets/${ethAddress}/tokens`
    );
    if (res.ok) {
      return res.json();
    }
    toast.error("Something went wrong while fetching your kudos");
    return [];
  };

  const getKudos = async (tokenId: number) => {
    const res = await fetch(
      `${process.env.MINTKUDOS_HOST}/v1/tokens/${tokenId}`
    );
    if (res.ok) {
      return res.json();
    }
    toast.error("Something went wrong while fetching your kudos");
    return [];
  };

  const addCustomKudosDesign = async (name: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${process.env.API_HOST}/circle/v1/${circle?.id}/addKudosDesign`,
      {
        method: "PATCH",
        body: formData,
        credentials: "include",
      }
    );
    if (res.ok) {
      return res.json();
    }
    toast.error("Something went wrong while adding custom design");
    return [];
  };

  const getCommunityKudosDesigns = async () => {
    const res = await fetch(
      `${process.env.API_HOST}/circle/v1/${circle?.id}/communityKudosDesigns`
    );
    if (res.ok) {
      return res.json();
    }
    toast.error("Something went wrong while fetching community kudos designs");
    return [];
  };

  return {
    mintKudos,
    claimKudos,
    getKudosOfUser,
    recordCollectionKudos,
    getKudos,
    addCustomKudosDesign,
    getCommunityKudosDesigns,
  };
}

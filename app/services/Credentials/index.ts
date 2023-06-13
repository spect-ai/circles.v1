import { kudosTokenTypes, kudosTypes } from "@/app/common/utils/constants";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { useLocalCollection } from "@/app/modules/Collection/Context/LocalCollectionContext";
import { KudosRequestType, KudosType, MappedItem } from "@/app/types";
import { useTheme } from "degen";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { signTypedData } from "@wagmi/core";
import { logError } from "@/app/common/utils/utils";

const chainId = "137";
const domainInfo = {
  name: "Kudos",
  chainId,
  verifyingContract: "0x60576A64851C5B42e8c57E3E4A5cF3CF4eEb2ED6",
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
          domain: domainInfo as any,
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
          communityId: communityId,
          nftTypeId: nftTypeId || "defaultOrangeRed",
          contributors: kudos.contributors,
          customAttributes: value.customAttributes,
          signature: signature,
        } as KudosRequestType;
        if (kudos.totalClaimCount)
          params.totalClaimCount = value.totalClaimCount;

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
        } else {
          logError("Error creating kudos");
          return false;
        }
      } catch (error: any) {
        if (error.name === "ConnectorNotFoundError") {
          toast.error(
            "Please login to your wallet and connect it to Spect, wallet might be locked"
          );
          return;
        }
        logError(error.message);
        console.log({ error });
        return;
      }
    }

    return null;
  };

  //   const recordTokenId = (operationId: string, kudosFor?: string) => {
  //     let time = 1000;
  //     const intervalPromise = setInterval(() => {
  //       time += 1000;
  //       fetch(`${process.env.MINTKUDOS_HOST}${operationId}`)
  //         .then(async (res) => {
  //           if (res.ok) {
  //             const data = await res.json();
  //             if (data.status === "success") {
  //               clearInterval(intervalPromise);
  //               const kudosForUsers = kudosFor || "assignee";
  //               fetch(`${process.env.API_HOST}/card/v1/${cardId}/recordKudos`, {
  //                 method: "PATCH",
  //                 body: JSON.stringify({
  //                   for: kudosForUsers,
  //                   tokenId: data.resourceId,
  //                   contributors:
  //                     kudosForUsers === "assignee" ? assignees : reviewers,
  //                 }),
  //                 headers: {
  //                   "Content-Type": "application/json",
  //                 },
  //                 credentials: "include",
  //               })
  //                 .then((res) => {
  //                   if (res.ok) {
  //                     res
  //                       .json()
  //                       .then((res2) => {
  //                         // Only update state if user is on same card
  //                         if (cardId === res2.id) setCard(res2);
  //                       })
  //                       .catch((err) => console.log(err));
  //                     toast.success("Successfully created kudos!", {
  //                       theme: mode,
  //                     });
  //                   }
  //                 })
  //                 .catch((err) => console.log(err));
  //             }
  //           }
  //         })
  //         .catch((err) => console.log(err));
  //     }, 1000);
  //     setTimeout(() => {
  //       clearInterval(intervalPromise);
  //     }, 20000);
  //   };

  const recordCollectionKudos = (
    operationId: string,
    minimumNumberOfAnswersThatNeedToMatch: number,
    responseData: MappedItem<any>,
    numOfKudos?: number
  ) => {
    console.log({ operationId });
    let time = 1000;
    const intervalPromise = setInterval(() => {
      time += 1000;
      console.log(time);
      fetch(`${process.env.MINTKUDOS_HOST}${operationId}`)
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            console.log(data);
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
                  },
                }),
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              })
                .then((res) => {
                  if (res.ok) {
                    res
                      .json()
                      .then((res2) => {
                        // Only update state if user is on same card
                        if (collection.slug === res2.slug)
                          setLocalCollection(res2);
                      })
                      .catch((err) => console.log(err));
                    toast.success("Successfully created kudos!", {
                      theme: mode,
                    });
                  } else {
                    logError("Something went wron creating kudos");
                  }
                })
                .catch((err) => console.log(err));
            }
          }
        })
        .catch((err) => console.error(err));
    }, 1000);
    setTimeout(() => {
      clearInterval(intervalPromise);
    }, 120000);
  };

  //   const viewKudos = async (): Promise<KudosType[]> => {
  //     const kudos = [];
  //     for (const [role, tokenId] of Object.entries(kudosMinted)) {
  //       const res = await fetch(
  //         `${process.env.MINTKUDOS_HOST}/v1/tokens/${tokenId}`
  //       );
  //       if (res.ok) {
  //         kudos.push(await res.json());
  //       }
  //     }
  //     return kudos;
  //   };

  const claimKudos = async (tokenId: number, claimingAddress: string) => {
    const value = {
      tokenId: tokenId, // mandatory
    };
    if (registry) {
      try {
        if (chain?.id.toString() !== chainId) {
          switchNetworkAsync && (await switchNetworkAsync(parseInt(chainId)));
        }
        const signature: string = await signTypedData({
          domain: domainInfo as any,
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
              claimingAddress: claimingAddress,
              signature: signature,
              tokenId: tokenId,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          console.log(data);

          return data;
        }
      } catch (error: any) {
        logError(error.message);
        return;
      }
    }
  };

  //   const recordClaimInfo = (operationId: string, kudosFor?: string) => {
  //     let time = 1000;
  //     const intervalPromise = setInterval(() => {
  //       time += 1000;
  //       console.log(time);
  //       fetch(`${process.env.MINTKUDOS_HOST}${operationId}`)
  //         .then(async (res) => {
  //           if (res.ok) {
  //             const data = await res.json();
  //             console.log(data);
  //             if (data.status === "success") {
  //               clearInterval(intervalPromise);
  //               fetch(
  //                 `${process.env.API_HOST}/card/v1/${cardId}/recordClaimInfo`,
  //                 {
  //                   method: "PATCH",
  //                   body: JSON.stringify({
  //                     for: kudosFor || "assignee",
  //                     tokenId: data.resourceId,
  //                   }),
  //                   headers: {
  //                     "Content-Type": "application/json",
  //                   },
  //                   credentials: "include",
  //                 }
  //               )
  //                 .then((res2) => {
  //                   if (res2.ok)
  //                     res2
  //                       .json()
  //                       .then((res2) => {
  //                         // Only update state if user is on same card
  //                         if (cardId === res2.id) setCard(res2);
  //                       })
  //                       .catch((err) => console.log(err));
  //                   toast.success("Successfully claimed kudos!", {
  //                     theme: mode,
  //                   });
  //                 })
  //                 .catch((err) => console.log(err));
  //             }
  //           }
  //         })
  //         .catch((err) => console.log(err));
  //     }, 1000);
  //     setTimeout(() => {
  //       clearInterval(intervalPromise);
  //     }, 120000);
  //   };

  const getKudosOfUser = async (ethAddress: string) => {
    const res = await fetch(
      `${process.env.MINTKUDOS_HOST}/v1/wallets/${ethAddress}/tokens`
    );
    if (res.ok) {
      return await res.json();
    } else {
      logError("Something went wrong while fetching your kudos");
      console.log(res);
      return [];
    }
  };

  const getKudos = async (tokenId: number) => {
    const res = await fetch(
      `${process.env.MINTKUDOS_HOST}/v1/tokens/${tokenId}`
    );
    if (res.ok) {
      return await res.json();
    } else {
      logError("Something went wrong while fetching your kudos");
      console.log(res);
      return [];
    }
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
      return await res.json();
    } else {
      logError("Something went wrong while adding custom design");
      console.log(res);
      return [];
    }
  };

  const getCommunityKudosDesigns = async () => {
    const res = await fetch(
      `${process.env.API_HOST}/circle/v1/${circle?.id}/communityKudosDesigns`
    );
    if (res.ok) {
      return await res.json();
    } else {
      logError("Something went wrong while fetching community kudos designs");
      console.log(res);
      return [];
    }
  };

  return {
    mintKudos,
    // recordTokenId,
    claimKudos,
    // viewKudos,
    // recordClaimInfo,
    getKudosOfUser,
    recordCollectionKudos,
    getKudos,
    addCustomKudosDesign,
    getCommunityKudosDesigns,
  };
}

import { kudosTokenTypes, kudosTypes } from "@/app/common/utils/constants";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { useLocalCollection } from "@/app/modules/Collection/Context/LocalCollectionContext";
import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { KudosRequestType, KudosType } from "@/app/types";
import { useTheme } from "degen";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useNetwork, useSwitchNetwork } from "wagmi";

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
  const { kudosMinted, setKudosMinted, cardId, assignees, reviewers, setCard } =
    useLocalCard();
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();
  const { mode } = useTheme();

  const mintKudos = async (kudos: KudosRequestType, communityId: string) => {
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
    };

    if (registry) {
      try {
        if (chain?.id.toString() !== chainId) {
          switchNetworkAsync && (await switchNetworkAsync(parseInt(chainId)));
        }
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );

        const signer = provider.getSigner();
        console.log(value);
        // Obtain signature
        const signature: string = await signer._signTypedData(
          domainInfo,
          kudosTypes,
          value
        );
        const body = JSON.stringify({
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
          nftTypeId: "defaultOrangeRed",
          contributors: kudos.contributors,
          totalClaimCount: value.totalClaimCount,
          signature: signature,
        });
        console.log(body);
        toast(
          "Minting Kudos takes a few seconds. You'll be notified once its successful.",
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
          toast.error("Error minting retro", {
            theme: mode,
          });
          return false;
        }
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
        return;
      }
    }

    return null;
  };

  const recordTokenId = (operationId: string, kudosFor?: string) => {
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
              const kudosForUsers = kudosFor || "assignee";
              fetch(`${process.env.API_HOST}/card/v1/${cardId}/recordKudos`, {
                method: "PATCH",
                body: JSON.stringify({
                  for: kudosForUsers,
                  tokenId: data.resourceId,
                  contributors:
                    kudosForUsers === "assignee" ? assignees : reviewers,
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
                        if (cardId === res2.id) setCard(res2);
                      })
                      .catch((err) => console.log(err));
                    toast.success("Successfully minted kudos!", {
                      theme: mode,
                    });
                  }
                })
                .catch((err) => console.log(err));
            }
          }
        })
        .catch((err) => console.log(err));
    }, 1000);
    setTimeout(() => {
      clearInterval(intervalPromise);
    }, 20000);
  };

  const recordCollectionKudos = (operationId: string) => {
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
                  mintkudosTokenId: data.resourceId,
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
                    toast.success("Successfully minted kudos!", {
                      theme: mode,
                    });
                  }
                })
                .catch((err) => console.log(err));
            }
          }
        })
        .catch((err) => console.log(err));
    }, 1000);
    setTimeout(() => {
      clearInterval(intervalPromise);
    }, 20000);
  };

  const viewKudos = async (): Promise<KudosType[]> => {
    const kudos = [];
    console.log("view");
    for (const [role, tokenId] of Object.entries(kudosMinted)) {
      console.log(kudosMinted);
      const res = await fetch(
        `${process.env.MINTKUDOS_HOST}/v1/tokens/${tokenId}`
      );
      if (res.ok) {
        kudos.push(await res.json());
      }
    }
    return kudos;
  };

  const claimKudos = async (tokenId: number, claimingAddress: string) => {
    const value = {
      tokenId: tokenId, // mandatory
    };
    if (registry) {
      try {
        if (chain?.id.toString() !== chainId) {
          switchNetworkAsync && (await switchNetworkAsync(parseInt(chainId)));
        }
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );

        const signer = provider.getSigner();
        console.log(value);
        // Obtain signature
        const signature: string = await signer._signTypedData(
          domainInfo,
          kudosTokenTypes,
          value
        );

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
        toast.error(error.message);
        console.log(error);
        return;
      }
    }
  };

  const recordClaimInfo = (operationId: string, kudosFor?: string) => {
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
              fetch(
                `${process.env.API_HOST}/card/v1/${cardId}/recordClaimInfo`,
                {
                  method: "PATCH",
                  body: JSON.stringify({
                    for: kudosFor || "assignee",
                    tokenId: data.resourceId,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              )
                .then((res2) => {
                  if (res2.ok)
                    res2
                      .json()
                      .then((res2) => {
                        // Only update state if user is on same card
                        if (cardId === res2.id) setCard(res2);
                      })
                      .catch((err) => console.log(err));
                  toast.success("Successfully claimed kudos!", {
                    theme: mode,
                  });
                })
                .catch((err) => console.log(err));
            }
          }
        })
        .catch((err) => console.log(err));
    }, 1000);
    setTimeout(() => {
      clearInterval(intervalPromise);
    }, 120000);
  };

  const getKudosOfUser = async (ethAddress: string) => {
    const res = await fetch(
      `${process.env.MINTKUDOS_HOST}/v1/wallets/${ethAddress}/tokens`
    );
    if (res.ok) {
      return await res.json();
    } else {
      toast.error("Something went wrong while fetching your kudos");
      console.log(res);
      return [];
    }
  };

  return {
    mintKudos,
    recordTokenId,
    claimKudos,
    viewKudos,
    recordClaimInfo,
    getKudosOfUser,
    recordCollectionKudos,
  };
}

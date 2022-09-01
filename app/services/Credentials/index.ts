import { kudosTokenTypes, kudosTypes } from "@/app/common/utils/constants";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { KudosRequestType, KudosType } from "@/app/types";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useNetwork } from "wagmi";
import React, { useEffect, useState } from "react";
import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";

export default function useCredentials() {
  const { registry } = useCircle();
  const { activeChain, switchNetworkAsync } = useNetwork();
  const { kudosMinted, setKudosMinted, kudosClaimed, setKudosClaimed, cardId } =
    useLocalCard();

  console.log(process.env);
  const mintKudos = async (kudos: KudosRequestType) => {
    const value = {
      ...kudos,
      headline: kudos.headline,
      description: kudos.description?.substring(1, 1000) || "",
      communityUniqId: process.env.communityId,
      startDateTimestamp: kudos.startDateTimestamp || 0,
      endDateTimestamp: kudos.endDateTimestamp || 0,
      expirationTimestamp: kudos.expirationTimestamp || 0,
      isSignatureRequired: true,
      isAllowlistRequired: true,
      links: kudos.links || [],
      totalClaimCount: 0,
    };
    const chainId = "80001";
    const domainInfo = {
      name: "Kudos",
      version: "7",

      // Mumbai
      chainId,
      verifyingContract: "0xB876baF8F69cD35fb96A17a599b070FBdD18A6a1",
    };

    if (registry) {
      try {
        if (activeChain?.id.toString() !== chainId) {
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
          communityId: process.env.communityId,
          nftTypeId: "defaultOrangeRed",
          contributors: kudos.contributors,
          signature: signature,
        });
        toast("Minting Kudos...", {
          theme: "dark",
        });
        const res = await fetch(`http://localhost:8080/card/v1/mintKudos`, {
          credentials: "include",
          method: "PATCH",
          body,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data);

          return data;
        } else {
          toast("Error creating retro", {
            theme: "dark",
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
      fetch(`https://sandbox-api.mintkudos.xyz${operationId}`)
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            console.log(data);

            if (data.status === "success") {
              clearInterval(intervalPromise);

              fetch(`http://localhost:8080/card/v1/${cardId}/recordKudos`, {
                method: "PATCH",
                body: JSON.stringify({
                  for: kudosFor || "assignee",
                  tokenId: data.resourceId,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((res) => {
                  if (res.ok)
                    setKudosMinted({
                      ...kudosMinted,
                      [kudosFor || "assignee"]: data.resourceId,
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
    }, 20000);
    console.log(intervalPromise);
    return intervalPromise;
  };

  const viewKudos = (tokenId: string) => {
    fetch(`https://sandbox-api.mintkudos.xyz/v1/tokens/${tokenId}`)
      .then(async (res2) => {
        const tokenData = await res2.json();
        return tokenData;
      })
      .catch((err) => console.log(err));
  };

  const claimKudos = async (tokenId: string, claimingAddress: string) => {
    const value = {
      tokenId: tokenId, // mandatory
    };
    const chainId = "80001";
    const domainInfo = {
      name: "Kudos",
      version: "7",

      // Mumbai
      chainId,
      verifyingContract: "0xB876baF8F69cD35fb96A17a599b070FBdD18A6a1",
    };
    if (registry) {
      try {
        if (activeChain?.id.toString() !== chainId) {
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

        toast("Minting Kudos...", {
          theme: "dark",
        });
        const res = await fetch(`http://localhost:8080/card/v1/mintKudos`, {
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
        });
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
        return;
      }
    }
  };

  return {
    mintKudos,
    recordTokenId,
    claimKudos,
    viewKudos,
  };
}

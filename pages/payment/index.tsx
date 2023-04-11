import PrimaryButton from "@/app/common/components/PrimaryButton";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import {
  LocalProfileContext,
  useProviderLocalProfile,
} from "@/app/modules/Profile/ProfileSettings/LocalProfileContext";
import CollectPayment from "@/app/modules/PublicForm/Fields/CollectPayment";
import DiscordField from "@/app/modules/PublicForm/Fields/DiscordField";
import GithubField from "@/app/modules/PublicForm/Fields/GithubField";
import TelegramField from "@/app/modules/PublicForm/Fields/TelegramField";
import { Connect } from "@/app/modules/Sidebar/ProfileButton/ConnectButton";
import {
  postFormPayment,
  postSocials,
  PostSocialsPayload,
} from "@/app/services/Collection";
import { CollectionType, PaymentConfig } from "@/app/types";
import { Avatar, Box, Text } from "degen";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const PaymentPage: NextPage = () => {
  const profileContext = useProviderLocalProfile();
  const router = useRouter();
  const { query } = router;
  const [backToDiscordMessage, setBackToDiscordMessage] = useState("");
  const [collection, setCollection] = useState<CollectionType>(
    {} as CollectionType
  );
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (query.channelId) {
      fetch(
        `${process.env.API_HOST}/collection/v1/${query.channelId}/collection`
      )
        .then((res) => res.json())
        .catch((err) => {
          console.log(err);
        })
        .then((data) => {
          setCollection(data);
        });
    }
  }, [query.channelId]);
  console.log("asasas");

  return (
    <>
      <MetaHead
        title={"Spect Payment"}
        description={"Payment to any address on EVM."}
        image={
          "https://spect.infura-ipfs.io/ipfs/QmcBLdB23dQkXdMKFHAjVKMKBPJF82XkqR5ZkxyCk6aset"
        }
      />
      <LocalProfileContext.Provider value={profileContext}>
        <DesktopContainer
          backgroundColor="backgroundSecondary"
          id="public-layout"
        >
          <Box
            display="flex"
            flexDirection="column"
            width="full"
            justifyContent="center"
            alignItems="center"
          >
            {collection && collection.formMetadata && collection.parents && (
              <CollectPayment
                data={data}
                setData={async (data) => {
                  const res = await postFormPayment(
                    query.channelId as string,
                    data.__payment__,
                    query.discordId as string
                  );

                  console.log({ res });
                  if (res.success)
                    setBackToDiscordMessage(
                      "Payment has been successfully made. Please close this tab & return to Discord."
                    );
                }}
                paymentConfig={
                  collection?.formMetadata?.paymentConfig as PaymentConfig
                }
                circleId={collection?.parents[0].id}
                circleSlug={collection?.parents[0].slug}
              />
            )}
          </Box>
        </DesktopContainer>
      </LocalProfileContext.Provider>
    </>
  );
};

export default React.memo(PaymentPage);

const DesktopContainer = styled(Box)`
  display: flex;
  flexdirection: row;
  height: 100vh;
  overflowy: auto;
  overflowx: hidden;
`;

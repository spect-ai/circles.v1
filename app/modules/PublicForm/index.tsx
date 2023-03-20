/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { getForm } from "@/app/services/Collection";
import { FormType, GuildRole, Stamp, UserType } from "@/app/types";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Avatar, Box, Text, Stack, useTheme, Button, Tag } from "degen";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import styled from "styled-components";
import FormFields from "./FormFields";
import { motion } from "framer-motion";
import Loader from "@/app/common/components/Loader";
import {
  getAllCredentials,
  getPassportScoreAndCredentials,
} from "@/app/services/Credentials/AggregatedCredentials";
import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import mixpanel from "@/app/common/utils/mixpanel";
import Image from "next/image";
import Editor from "@/app/common/components/Editor";
import DataActivity from "../Collection/Form/DataDrawer/DataActivity";
import _ from "lodash";
import { useLocation } from "react-use";
import SocialMedia from "@/app/common/components/SocialMedia";
import { connectedUserAtom, socketAtom } from "@/app/state/global";
import { useAtom } from "jotai";
import { SkeletonLoader } from "./SkeletonLoader";
import { WalletFilled, WalletOutlined } from "@ant-design/icons";
import { quizValidFieldTypes } from "../Plugins/common/ResponseMatchDistribution";
import Link from "next/link";

function PublicForm() {
  const router = useRouter();
  const { formId } = router.query;
  const [form, setForm] = useState<FormType>();
  const { mode } = useTheme();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { openConnectModal } = useConnectModal();
  const [loading, setLoading] = useState(false);
  const [canFillForm, setCanFillForm] = useState(
    form?.formMetadata.canFillForm || false
  );
  const [stamps, setStamps] = useState([] as Stamp[]);
  const [socket, setSocket] = useAtom(socketAtom);
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);
  const [memberDetails, setMemberDetails] = useState({} as any);
  const [currentScore, setCurrentScore] = useState(0);
  const [hasStamps, setHasStamps] = useState({} as any);
  const { pathname } = useLocation();
  const route = pathname?.split("/")[3];

  const quizValidFields =
    form?.propertyOrder &&
    form.propertyOrder.filter(
      (propertyName) =>
        form.properties[propertyName].isPartOfFormView &&
        quizValidFieldTypes.includes(form.properties[propertyName].type)
    );

  const getMemberDetails = React.useCallback(
    (id: string) => {
      return memberDetails?.memberDetails[id];
    },
    [memberDetails]
  );
  const fetchMemberDetails = async (cId: string) => {
    const res = await (
      await fetch(
        `${process.env.API_HOST}/circle/${cId}/memberDetailsWithSlug?circleSlugs=${cId}`
      )
    ).json();
    if (res.members) setMemberDetails(res);
    else toast.error("Error fetching member details");
  };

  const addStamps = async (form: FormType) => {
    const stamps = await getAllCredentials();
    const stampsWithScore = [];
    if (
      form.formMetadata.sybilProtectionEnabled &&
      form.formMetadata.sybilProtectionScores
    ) {
      for (const stamp of stamps) {
        if (form.formMetadata.sybilProtectionScores[stamp.id]) {
          const stampWithScore = {
            ...stamp,
            score: form.formMetadata.sybilProtectionScores[stamp.id],
          };
          stampsWithScore.push(stampWithScore);
        }
      }
      setStamps(stampsWithScore.sort((a, b) => b.score - a.score));
    }
  };
  useEffect(() => {
    void (async () => {
      if (formId) {
        setLoading(true);
        const res: FormType = await getForm(formId as string);
        if (res.id) {
          await fetchMemberDetails(res.parents[0].slug);
          setForm(res);
          setCanFillForm(res.formMetadata.canFillForm);
          await addStamps(res);
        } else toast.error("Error fetching form");
        setLoading(false);
      }
    })();
  }, [connectedUser, formId]);

  useEffect(() => {
    if (socket && socket.on && formId) {
      socket.on(
        `${formId}:newActivityPublic`,
        _.debounce(async (event: { user: string }) => {
          console.log({ event, connectedUser });
          if (event.user !== connectedUser) {
            const res: FormType = await getForm(formId as string);
            setForm(res);
          }
        }, 2000)
      );
    }
    return () => {
      if (socket && socket.off) {
        socket.off(`${formId}:newActivityPublic`);
      }
    };
  }, [connectedUser, formId, socket]);

  // useEffect(() => {
  //   if (
  //     form &&
  //     form.formMetadata &&
  //     form.formMetadata.sybilProtectionEnabled &&
  //     form.formMetadata.sybilProtectionScores &&
  //     currentUser
  //   ) {
  //     console.log("getting score");
  //     void (async () => {
  //       const res = await getPassportScoreAndCredentials(
  //         currentUser?.ethAddress,
  //         form.formMetadata.sybilProtectionScores
  //       );
  //       console.log({ result: res });
  //       setCurrentScore(res?.score);
  //       setHasStamps(res?.mappedStampsWithCredentials);
  //     })();
  //   }
  // }, [form, currentUser]);
  return (
    <ScrollContainer
      backgroundColor={
        route === "embed" ? "transparent" : "backgroundSecondary"
      }
    >
      <ToastContainer
        toastStyle={{
          backgroundColor: `${
            mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
          }`,
          color: `${
            mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
          }`,
        }}
      />
      {route !== "embed" && (
        <CoverImage
          src={form?.formMetadata.cover || ""}
          backgroundColor="accentSecondary"
        />
      )}
      <Container embed={route === "embed"}>
        <FormContainer
          backgroundColor={route === "embed" ? "transparent" : "background"}
          borderRadius={route === "embed" ? "none" : "2xLarge"}
          style={{
            boxShadow: `0rem 0.2rem 0.5rem ${
              mode === "dark" ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.1)"
            }`,
          }}
        >
          {(loading || !form) && <SkeletonLoader />}
          {!loading && form && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FormFields form={form} setForm={setForm} />
            </motion.div>
          )}
        </FormContainer>
        <Stack align={"center"}>
          <Text variant="label">Powered By</Text>
          <a
            href="https://spect.network/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {mode == "dark" ? (
              <Image
                src={"/logo2.svg"}
                alt="dark-mode-logo"
                height={"35"}
                width="138"
              />
            ) : (
              <Image
                src={"/logo1.svg"}
                alt="light-mode-logo"
                height={"35"}
                width="138"
              />
            )}
          </a>{" "}
          <Text variant="large">
            💪 Powerful Web3 Forms, Projects and Automations 🤝
          </Text>
          <a href="/" target="_blank">
            <PrimaryButton
              onClick={() => {
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Create your own form", {
                    form: form?.name,
                    sybilEnabled: form?.formMetadata.sybilProtectionEnabled,
                    user: currentUser?.username,
                  });
              }}
            >
              Build With Spect
            </PrimaryButton>
          </a>
        </Stack>
        <Box marginBottom="8" />
      </Container>
    </ScrollContainer>
  );
}

const Container = styled(Box)<{ embed: boolean }>`
  @media (max-width: 768px) {
    padding: 0rem ${(props) => (props.embed ? "0rem" : "1rem")};
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    padding: ${(props) => (props.embed ? "0rem" : "2rem")}
      ${(props) => (props.embed ? "0rem" : "4rem")};
  }

  @media (min-width: 1024px) and (max-width: 1280px) {
    padding: ${(props) => (props.embed ? "0rem" : "2rem")}
      ${(props) => (props.embed ? "0rem" : "14rem")};
  }

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  z-index: 999;
  margin-top: ${(props) => (props.embed ? "0rem" : "-8rem")};
  padding: 0rem ${(props) => (props.embed ? "0rem" : "14rem")};
`;

export const CoverImage = styled(Box)<{ src: string }>`
  width: 100%;
  height: 18rem;
  background-image: url(${(props) => props.src});
  background-size: cover;
  z-index: -1;
  border-radius: 1rem;
`;

const FormContainer = styled(Box)`
  padding: 0.5rem;
  margin-bottom: 2rem;
`;

const ScrollContainer = styled(Box)`
  &::-webkit-scrollbar {
    width: 0.2rem;
  }
  max-height: calc(100vh);
  overflow-y: auto;
`;

const StampScrollContainer = styled(Box)`
  overflow-y: auto;
  height: calc(100vh - 35rem);
  ::-webkit-scrollbar {
    width: 5px;
  }
`;

export const StampCard = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  padding: 1rem 1rem;
  border-radius: 0.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
  position: relative;
  transition: all 0.3s ease-in-out;
  width: 80%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

PublicForm.whyDidYouRender = true;

export default React.memo(PublicForm);

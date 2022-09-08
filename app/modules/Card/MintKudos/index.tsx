import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useCredentials from "@/app/services/Credentials";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import {
  getPrivateCircleCredentials,
  GetPrivateCirclePropertiesDto,
} from "@/app/services/PrivateCircle";
import {
  KudosRequestType,
  KudosType,
  Permissions,
  UserType,
} from "@/app/types";
import { Box, Stack, Textarea } from "degen";
import { AnimatePresence } from "framer-motion";
import router from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useCircle } from "../../Circle/CircleContext";
import SettingsModal from "../../Circle/CircleSettingsModal";
import { useLocalProject } from "../../Project/Context/LocalProjectContext";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import SoulboundToken from "./SoulboundToken";

export default function MintKudos() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { title, project, assignees } = useLocalCard();
  const { circle: cId, project: pId, card: tId } = router.query;

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const {
    circle,
    hasMintkudosCredentialsSetup,
    setHasMintkudosCredentialsSetup,
    setMintkudosCommunityId,
    mintkudosCommunityId,
  } = useCircle();

  const { mintKudos, recordTokenId } = useCredentials();
  const { getMemberDetails } = useModalOptions();
  const [perm, setPerm] = useState({} as Permissions);

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const [headlineContent, setHeadlineContent] = useState(
    `Thank you for your contribution to ${circle?.name}!`
  );

  const getEthAddress = () => {
    return assignees.map((userId) => {
      return getMemberDetails(userId)?.ethAddress;
    });
  };
  useEffect(() => {
    fetch(
      `${process.env.API_HOST}/circle/myPermissions?circleIds=${circle?.id}`,
      {
        credentials: "include",
      }
    )
      .then((res) => {
        res
          .json()
          .then((permissions: Permissions) => {
            setPerm(permissions);
            if (permissions?.distributeCredentials) {
              getPrivateCircleCredentials(circle?.id as string)
                .then((creds: GetPrivateCirclePropertiesDto | boolean) => {
                  const credentials = creds as GetPrivateCirclePropertiesDto;
                  if (
                    credentials &&
                    credentials.mintkudosApiKey &&
                    credentials.mintkudosCommunityId
                  ) {
                    setHasMintkudosCredentialsSetup(true);
                    setMintkudosCommunityId(credentials.mintkudosCommunityId);
                  }
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {perm && perm.distributeCredentials && (
        <PrimaryButton
          variant="tertiary"
          onClick={() => {
            if (!assignees || assignees.length === 0) {
              toast.error("Kudos can only be minted when there are assignees.");
              return;
            } else if (hasMintkudosCredentialsSetup) setIsOpen(true);
            else {
              if (perm?.manageCircleSettings) {
                setIsSettingsModalOpen(true);
                toast.info(
                  "Please add Mintkudos credentials to be able to mint kudos!"
                );
              } else {
                toast.info(
                  `Mintkudos credentials haven't been added. Please check with a member who has permissions to manage circle settings.`
                );
              }
            }
          }}
        >
          Mint Kudos 🎉
        </PrimaryButton>
      )}
      {isSettingsModalOpen && (
        <SettingsModal
          handleClose={() => {
            setIsSettingsModalOpen(false);
          }}
          initialTab={2}
        />
      )}
      <AnimatePresence>
        {isOpen && (
          <Modal
            size="small"
            title="Mint Kudos 🎉"
            handleClose={() => setIsOpen(false)}
          >
            <Box
              paddingTop="2"
              paddingRight="8"
              paddingLeft="8"
              paddingBottom="4"
            >
              <Box padding="1" paddingTop="4" paddingBottom="4" width="full">
                <Stack>
                  <Textarea
                    label="Headline"
                    value={headlineContent}
                    onChange={(e) => setHeadlineContent(e.target.value)}
                    maxLength={50}
                  />
                </Stack>
              </Box>
              {/* <Box width="1/2" paddingRight="8" paddingBottom="4">
                <SoulboundToken
                  content={`${headlineContent}`}
                  issuedBy={`${circle?.name}`}
                  issuedOn={new Date().toISOString().slice(0, 10)}
                  issuerAvatar={`${circle?.avatar}`}
                />
              </Box> */}
              <PrimaryButton
                loading={loading}
                onClick={async () => {
                  setLoading(true);

                  const res = await mintKudos(
                    {
                      headline: headlineContent,
                      description: title,
                      creator: currentUser?.ethAddress as string,
                      links: [
                        `https://circles.spect.network/${cId}/${pId}/${tId}`,
                      ],
                      contributors: getEthAddress(),
                    } as KudosRequestType,
                    mintkudosCommunityId
                  );
                  if (res) {
                    recordTokenId(res.operationId);
                  }
                  setLoading(false);
                  if (res) {
                    setIsOpen(false);
                  }
                }}
              >
                Mint
              </PrimaryButton>
            </Box>
          </Modal>
        )}
      </AnimatePresence>{" "}
    </>
  );
}

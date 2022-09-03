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
  const { title, project, assignees, slug } = useLocalCard();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { circle } = useCircle();

  const { mintKudos, recordTokenId } = useCredentials();
  const { getMemberDetails } = useModalOptions();
  const [perm, setPerm] = useState({} as Permissions);
  const [hasMintkudosSetup, setHasMintkudosSetup] = useState(false);

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
                  if (
                    creds &&
                    (creds as GetPrivateCirclePropertiesDto).mintkudosApiKey &&
                    (creds as GetPrivateCirclePropertiesDto)
                      .mintkudosCommunityId
                  ) {
                    setHasMintkudosSetup(true);
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
            if (hasMintkudosSetup) setIsOpen(true);
            else {
              setIsSettingsModalOpen(true);
              toast.info(
                "Please add Mintkudos credentials to be able to mint kudos!"
              );
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
            size="large"
            title="Mint Kudos 🎉"
            handleClose={() => setIsOpen(false)}
          >
            <Box
              display="flex"
              flexDirection="row"
              paddingTop="2"
              paddingRight="8"
              paddingLeft="8"
              paddingBottom="4"
            >
              <Box padding="1" paddingTop="4" width="2/3">
                <Stack>
                  <Textarea
                    label="Headline"
                    value={headlineContent}
                    onChange={(e) => setHeadlineContent(e.target.value)}
                    maxLength={50}
                  />
                  <PrimaryButton
                    loading={loading}
                    onClick={async () => {
                      setLoading(true);

                      const res = await mintKudos({
                        headline: headlineContent,
                        description: title,
                        creator: currentUser?.ethAddress as string,
                        links: [`https://circles.spect.network/`],
                        contributors: getEthAddress(),
                      } as KudosRequestType);
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
                </Stack>
              </Box>
              <Box width="1/3" paddingRight="8" paddingBottom="4">
                <SoulboundToken
                  content={`${headlineContent}`}
                  issuedBy={`${circle?.name}`}
                  issuedOn={new Date().toISOString().slice(0, 10)}
                  issuerAvatar={`${circle?.avatar}`}
                />
              </Box>
            </Box>
          </Modal>
        )}
      </AnimatePresence>{" "}
    </>
  );
}

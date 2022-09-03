import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useCredentials from "@/app/services/Credentials";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { KudosType, UserType } from "@/app/types";
import { Box, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { TwitterShareButton } from "react-share";

type CanClaimType = {
  [tokenId: string]: boolean;
};

export default function ViewKudos() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const {
    title,
    project,
    assignees,
    reviewers,
    eligibleToClaimKudos,
    kudosClaimedBy,
    kudosMinted,
  } = useLocalCard();
  const { circle } = useCircle();
  const { viewKudos, recordClaimInfo, claimKudos } = useCredentials();
  const { getMemberDetails } = useModalOptions();
  const [kudos, setKudos] = useState([] as KudosType[]);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [canClaim, setCanClaim] = useState({} as CanClaimType);
  const [alreadyClaimed, setAlreadyClaimed] = useState({} as CanClaimType);
  // This makes too many requests (may lead us to getting rate limited)
  //   const { data: kudos } = useQuery<KudosType[]>("viewKudos", viewKudos, {
  //     enabled: false,
  //   });

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const canClaimInfo = {} as CanClaimType;
      const alreadyClaimedInfo = {} as CanClaimType;

      console.log(eligibleToClaimKudos);
      console.log(kudosClaimedBy);
      console.log(kudosMinted);
      console.log(currentUser?.id);

      for (const [kudoFor, tokenId] of Object.entries(kudosMinted)) {
        const tknId = tokenId as string;
        const unClaimed =
          !kudosClaimedBy ||
          !kudosClaimedBy[tknId] ||
          !kudosClaimedBy[tknId].includes(currentUser?.id as string);
        const eligible =
          eligibleToClaimKudos &&
          eligibleToClaimKudos[tknId]?.includes(currentUser?.id as string);
        if (eligible) {
          canClaimInfo[tknId] = true;
        }
        alreadyClaimedInfo[tknId] = true;
        if (unClaimed) {
          alreadyClaimedInfo[tknId] = false;
        }
      }
      setCanClaim(canClaimInfo);
      setAlreadyClaimed(alreadyClaimedInfo);
      viewKudos()
        .then((res) => {
          console.log(res);
          setKudos(res);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  return (
    <>
      {kudosMinted && (
        <PrimaryButton
          variant="tertiary"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          View Kudos 🎉
        </PrimaryButton>
      )}
      <AnimatePresence>
        {isOpen && !loading && (
          <Modal
            size="medium"
            title="View Kudos 🎉"
            handleClose={() => setIsOpen(false)}
          >
            {kudos.map((kudo, index) => (
              <Box
                key={index}
                paddingTop="6"
                paddingRight="12"
                paddingLeft="8"
                paddingBottom="4"
              >
                <Box display="flex" flexDirection="row" paddingBottom="4">
                  <Box width="1/2" paddingRight="4">
                    <Box paddingBottom="4">
                      <Text as="label">Card Title</Text>
                      <Text size="headingThree" weight="bold">
                        {kudo.description}
                      </Text>
                    </Box>
                  </Box>
                  <Box width="1/2">
                    <Image
                      src={kudo.imageUrl}
                      width="100%"
                      height="100%"
                      layout="responsive"
                      objectFit="contain"
                      alt="Kudos img"
                    />
                  </Box>
                </Box>
                {canClaim[kudo.tokenId] && (
                  <Stack>
                    <PrimaryButton
                      loading={claimLoading}
                      disabled={alreadyClaimed[kudo.tokenId]}
                      onClick={async () => {
                        setClaimLoading(true);
                        const res = await claimKudos(
                          kudo.tokenId,
                          currentUser?.ethAddress as string
                        );
                        if (res) {
                          recordClaimInfo(res.operationId);
                        }
                        setClaimLoading(false);

                        if (res) {
                          setIsOpen(false);
                        }
                      }}
                    >
                      {alreadyClaimed[kudo.tokenId] ? "Claimed" : "Claim"}
                    </PrimaryButton>
                    {alreadyClaimed[kudo.tokenId] && (
                      <TwitterShareButton
                        url={"https://circles.spect.network/"}
                        title={
                          "Look mom! I just claimed my Kudos on @JoinSpect via mintkudosXYZ 🎉"
                        }
                      >
                        <PrimaryButton> Share</PrimaryButton>
                      </TwitterShareButton>
                    )}
                  </Stack>
                )}
              </Box>
            ))}
          </Modal>
        )}
      </AnimatePresence>{" "}
    </>
  );
}

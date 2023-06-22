import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { duplicateCircle } from "@/app/services/Circle";
import { useTemplate } from "@/app/services/Templates";
import { SpectTemplate, UserType } from "@/app/types";
import {
  Box,
  Button,
  IconChevronLeft,
  Input,
  Spinner,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useProviderLocalProfile } from "../Profile/ProfileSettings/LocalProfileContext";
import Logo from "@/app/common/components/Logo";
import { toast } from "react-toastify";

type Props = {
  template: SpectTemplate;
  handleClose: () => void;
};

export default function CreateFromTemplateModal({
  template,
  handleClose,
}: Props) {
  const { mode } = useTheme();
  const [destinationCircleId, setDestinationCircleId] = useState<string>("");
  const [newCircleName, setNewCircleName] = useState<string>("");
  const { myCircles, fetchCircles, loadingMyCircles } =
    useProviderLocalProfile();
  console.log({ myCircles });
  useEffect(() => {
    void (async () => {
      await fetchCircles();
    })();
  }, []);

  return (
    <Modal size="small" title="Use Template" handleClose={handleClose}>
      <Box padding="8" paddingTop="4">
        {loadingMyCircles && <Spinner />}
        {!loadingMyCircles && myCircles && myCircles?.length > 0 ? (
          <Stack space="4">
            <Text variant="base" color="textSecondary">
              Pick a space where you would like to add this template
            </Text>
            <ScrollContainer>
              <Stack direction="horizontal" space="4" wrap>
                {myCircles
                  ?.filter(
                    (circle) => !circle.parents || circle.parents?.length === 0
                  )
                  .map((circle) => (
                    <SpaceTag
                      mode={mode}
                      key={circle.id}
                      cursor="pointer"
                      onClick={async () => {
                        try {
                          const res = await useTemplate(template.id, circle.id);
                          console.log(res);
                          if (res.ok) {
                            const data = await res.json();
                            console.log({ data });
                            window.open(
                              `http://localhost:3000/${data.id}`,
                              "_blank"
                            );
                          }
                        } catch (e) {
                          console.log({ e });
                          toast.error(
                            "Something went wrong while using this template"
                          );
                        }
                      }}
                    >
                      <Logo
                        href={``}
                        src={circle.avatar}
                        gradient={circle.gradient}
                        name={circle.name}
                        size={"7"}
                      />
                      <Text>{circle.name}</Text>
                    </SpaceTag>
                  ))}
              </Stack>{" "}
            </ScrollContainer>
          </Stack>
        ) : (
          <Stack space="4">
            <Input
              label="Please create a space where this template will be used"
              placeholder="Enter a name for your space"
              value={newCircleName}
              onChange={(e) => setNewCircleName(e.target.value)}
            />
            <PrimaryButton
              size="large"
              variant="secondary"
              onClick={async () => {
                const circleRes = await fetch(
                  `${process.env.API_HOST}/circle/v1`,
                  {
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                      name: newCircleName,
                    }),
                    credentials: "include",
                  }
                );
                const circleData = await circleRes.json();
                console.log({ circleData });
                const res = await useTemplate(template.id, circleData.id);
                console.log(res);
                if (res.ok) {
                  const data = await res.json();
                  console.log({ data });
                  window.open(`http://localhost:3000/${data.id}`, "_blank");
                }
              }}
            >
              Use Template
            </PrimaryButton>
          </Stack>
        )}
      </Box>
    </Modal>
  );
}

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  max-height: 24rem;
  ::-webkit-scrollbar {
    width: 0.5rem;
  }
`;

export const SpaceTag = styled(Box)<{ mode: string }>`
  border-radius: 1.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  transition: all 0.3s ease-in-out;
  padding: 0.1rem 1.5rem;
  justify-content: center;
  align-items: center;
  display: flex;
  width: fit-content;
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
`;

import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import { getLensProfileHandles } from "@/app/services/Lens";
import { Milestone, Option, Registry, UserType } from "@/app/types";
import { Box, Button, Input, Stack, Tag, Text, useTheme } from "degen";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

type Props = {
  handleClose: () => void;
};

export default function LensImportModal({ handleClose }: Props) {
  const [lensProfiles, setLensProfiles] = useState([] as string[]);
  const [selectedHandle, setSelectedHandle] = useState("");
  const [attributes, setAttributes] = useState({
    experience: [],
    education: [],
  });
  const [loading, setLoading] = useState(false);

  const { mode } = useTheme();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  useEffect(() => {
    setLoading(true);
    getLensProfileHandles()
      .then((res) => {
        console.log(res);
        // for (const attribute of res[0].attributes) {
        //   console.log(attribute.key);
        //   if (attribute.key === "experience")
        //     console.log(JSON.parse(attribute.value));
        // }
        setLensProfiles(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <Modal
      handleClose={() => {
        handleClose();
      }}
      title={`Import from Lens`}
      size="small"
    >
      <Box
        padding={{
          xs: "4",
          md: "8",
        }}
        width="full"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        gap="4"
      >
        {!loading && (
          <>
            <Text variant="label">Pick a Lens Handle</Text>
            <ScrollContainer>
              {lensProfiles?.length &&
                lensProfiles.map((profile: any) => (
                  <Container
                    borderRadius="large"
                    display="flex"
                    flexDirection="column"
                    width="full"
                    marginRight={{ xs: "2", md: "4" }}
                    transitionDuration="700"
                    backgroundColor="background"
                    height="12"
                    key={profile.handle}
                    onClick={() => {
                      setSelectedHandle(profile.handle);
                      setAttributes({
                        experience:
                          JSON.parse(
                            profile.attributes.find(
                              (a: any) => a.key === "experience"
                            )?.value
                          ) || [],
                        education:
                          JSON.parse(
                            profile.attributes.find(
                              (a: any) => a.key === "education"
                            )?.value
                          ) || [],
                      });
                    }}
                  >
                    <Box padding="1" paddingLeft="2">
                      <Text variant="large">{profile.handle}</Text>
                    </Box>
                  </Container>
                ))}
            </ScrollContainer>
          </>
        )}
        {!loading && !lensProfiles?.length && (
          <Text variant="small">No Lens Profiles Found</Text>
        )}
      </Box>
    </Modal>
  );
}
const Container = styled(Box)`
  border: 0.1rem solid transparent;
  cursor: pointer;
  &:hover {
    border-color: rgb(191, 90, 242, 1);
  }
`;
const ScrollContainer = styled(Box)`
  overflow-y: auto;
  max-height: 24rem;
  ::-webkit-scrollbar {
    width: 3px;
  }
`;

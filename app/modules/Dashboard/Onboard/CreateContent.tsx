import { Heading, Stack, Text, Button, IconSparkles, Box } from "degen";
import styled from "styled-components";
import { useState, useEffect } from "react";
import {
  ProfileOutlined,
  RocketOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { NameInput } from "./BasicProfile";
import { createFolder } from "@/app/services/Folders";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { CircleType, UserType } from "@/app/types";
import mixpanel from "@/app/common/utils/mixpanel";
import { Hidden } from "react-grid-system";

const Card = styled(Box)<{ border: boolean }>`
  max-width: 18rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 2px solid
    ${(props) =>
      props.border ? "rgb(191, 90, 242, 1)" : "rgb(255, 255, 255, 0.1)"};
  &:hover {
    border-color: rgb(191, 90, 242, 1);
  }
  text-align: center;
  align-items: center;
  transition-duration: 0.7s;
  cursor: pointer;
`;

type CreateCollectionDto = {
  name: string;
  private: boolean;
  circleId: string;
  defaultView?: "form" | "table" | "kanban" | "list" | "gantt";
  collectionType: 0 | 1;
};

export function CreateContent() {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [itemType, setItemType] = useState<"Form" | "Project">("Form");

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const { data: myCircles, refetch } = useQuery<CircleType[]>(
    "myOrganizations",
    () =>
      fetch(`${process.env.API_HOST}/circle/myOrganizations`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  const { mutateAsync } = useMutation((circle: CreateCollectionDto) => {
    return fetch(`${process.env.API_HOST}/collection/v1`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(circle),
      credentials: "include",
    });
  });

  const createSorm = (type: 0 | 1) => {
    mutateAsync({
      name: itemName,
      private: false,
      circleId: myCircles?.[0]?.id as string,
      defaultView: type === 0 ? "form" : "table",
      collectionType: type,
    })
      .then(async (res) => {
        const resJson = await res.json();
        if (resJson.slug) {
          const payload = {
            name: "Section 1",
            avatar: "All",
            contentIds: [resJson.id],
          };
          const res = await createFolder(payload, myCircles?.[0]?.id as string);
          process.env.NODE_ENV === "production" &&
            mixpanel.track("Onboard sorms", {
              user: currentUser?.username,
            });
          if (res) {
            void router.push(`/${res.slug}/r/${resJson.slug}`);
          }
        }
      })
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <Box
        marginTop={"40"}
        display="flex"
        flexDirection="column"
        gap={{ xs: "10", md: "10", lg: "5" }}
      >
        <RocketOutlined
          style={{ fontSize: "5rem", color: "rgb(191, 90, 242, 1)" }}
          rotate={30}
        />
        <Heading align={"center"}>Boosting up your Spect experience</Heading>
      </Box>
    );

  return (
    <Box
      display={"flex"}
      flexDirection="column"
      gap={"5"}
      alignItems="center"
      marginTop={"20"}
    >
      <Stack
        direction={{ xs: "vertical", md: "horizontal", lg: "horizontal" }}
        align="center"
      >
        <RocketOutlined
          style={{ fontSize: "2.5rem", color: "rgb(191, 90, 242, 1)" }}
          rotate={30}
        />
        <Heading align={"center"}>All set ! This is the final step</Heading>
      </Stack>
      <Text>What would you like to create ?</Text>
      <Stack direction={{ xs: "vertical", md: "horizontal", lg: "horizontal" }}>
        <Card border={itemType == "Form"} onClick={() => setItemType("Form")}>
          <Stack direction={"horizontal"} align="center" space={"2"}>
            <ProfileOutlined
              style={{ fontSize: "1.1rem", color: "rgb(191, 90, 242, 1)" }}
            />
            <Text
              size={"extraLarge"}
              variant="extraLarge"
              color={"textPrimary"}
              align="center"
            >
              Spect Form
            </Text>
          </Stack>
          <Text>
            Spect Forms are the first sybil-resistant, credential curated, Web3
            enabled forms to help power grants, bounties and onboarding!
          </Text>
        </Card>
        <Hidden xs sm>
          <Card
            border={itemType == "Project"}
            onClick={() => setItemType("Project")}
          >
            <Stack direction={"horizontal"} align="center" space={"2"}>
              <ProjectOutlined
                style={{ fontSize: "1.1rem", color: "rgb(191, 90, 242, 1)" }}
              />
              <Text
                size={"extraLarge"}
                variant="extraLarge"
                color={"textPrimary"}
                align="center"
              >
                Project
              </Text>
            </Stack>
            <Text>
              Projects are used to manage tasks, grants, bounties and onboarding
              and pay out contributors on any EVM network.
            </Text>
          </Card>
        </Hidden>
      </Stack>
      <Text>Give your {itemType} a name </Text>
      <NameInput
        placeholder={
          itemType == "Project"
            ? "Grant Milestones"
            : "Onboarding Interest Form"
        }
        value={itemName}
        onChange={(e) => {
          setItemName(e.target.value);
        }}
      />
      <Button
        onClick={() => {
          setIsLoading(true);
          void refetch();
          if (itemType == "Form") {
            createSorm(0);
            return;
          }
          if (itemType == "Project" && myCircles?.[0]?.id) {
            createSorm(1);
            return;
          }
        }}
        prefix={<IconSparkles size="5" />}
        variant="secondary"
        size="small"
        disabled={itemName.length == 0}
      >
        Create {itemType}
      </Button>
    </Box>
  );
}

import { Heading, Stack, Text, Button, IconSparkles, Box } from "degen";
import styled from "styled-components";
import { useState, useEffect } from "react";
import {
  ProfileOutlined,
  RocketOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { NameInput } from "./BasicProfile";
import { createProject } from "@/app/services/Project";
import { createFolder } from "@/app/services/Folders";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { CircleType } from "@/app/types";

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
};

export function CreateContent() {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [itemType, setItemType] = useState<"Sorm" | "Project">("Sorm");

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

  const createSorm = () => {
    mutateAsync({
      name: itemName,
      private: false,
      circleId: myCircles?.[0]?.id as string,
      defaultView: "form",
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
          if (res) {
            void router.push(`/${res.slug}/r/${resJson.slug}`);
          }
        }
      })
      .catch((err) => console.log({ err }));
  };

  const createProj = async () => {
    const data = await createProject({
      name: itemName,
      circleId: myCircles?.[0]?.id as string,
      description: "",
      fromTemplateId: "6316cfe0013982438514cc7a",
    });

    if (data) {
      const payload = {
        name: "Section 1",
        avatar: "All",
        contentIds: [data.id],
      };
      const res = await createFolder(payload, myCircles?.[0]?.id as string);
      if (res) {
        void router.push(`/${res.slug}/${data.slug}`);
      }
    }
  };

  useEffect(() => {
    void refetch();
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
        <Card border={itemType == "Sorm"} onClick={() => setItemType("Sorm")}>
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
              Sorm
            </Text>
          </Stack>
          <Text>
            Sorms are sybil-resistant Web3 enabled forms with mintkudos, poap
            integrations and e-mail service for the applicants
          </Text>
        </Card>
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
            Project is where actual tasks, grants and bounties are managed with
            functionality to pay out contributors on any EVM chain.
          </Text>
        </Card>
      </Stack>
      <Text>Give your {itemType} a name </Text>
      <NameInput
        placeholder={
          itemType == "Project" ? "Product Development" : "Airdrop Whitelist"
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
          if (itemType == "Sorm") {
            createSorm();
            return;
          }
          if (itemType == "Project" && myCircles?.[0]?.id) {
            void createProj();
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
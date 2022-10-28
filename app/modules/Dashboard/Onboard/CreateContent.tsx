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
import { useQuery } from "react-query";
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

export function CreateContent() {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const createSorm = () => {};

  const createProj = async () => {
    setIsLoading(true);
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
        setIsLoading(false);
        void router.push(`/${res.slug}`)
      }
    }
  };

  useEffect(() => {
    void refetch();
  },[])
  return (
    <Stack justify={"center"} direction="vertical" align={"center"} space="6">
      <Stack direction={"horizontal"} align="center">
        <RocketOutlined
          style={{ fontSize: "2.5rem", color: "rgb(191, 90, 242, 1)" }}
          rotate={30}
        />
        <Heading>All set ! This is the final step</Heading>
      </Stack>
      <Text>What would you like to create ?</Text>
      <Stack direction={"horizontal"}>
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
          void refetch();
          if (itemType == "Sorm") {
            createSorm();
            return;
          }
          if (itemType == "Project" && myCircles?.[0]?.id ) {
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
    </Stack>
  );
}

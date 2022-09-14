import { memo } from "react";
import { Box, Text, Tag, Avatar, useTheme } from "degen";
import { UserType } from "@/app/types";
import { ScrollContainer, Card, TextBox, GigInfo, Tags } from "./index";

const Retro = ({ userData }: { userData: UserType }) => {
  const { mode } = useTheme();

  return (
    <ScrollContainer>
      {userData?.retro?.length == 0 && (
        <Box style={{ margin: "35vh 15vw" }}>
          <Text color="accent" align="center">
            No Retros to show.
          </Text>
        </Box>
      )}
      {userData?.retro?.map((ret) => {
        const retroInfo = userData?.retroDetails?.[ret];
        return (
          <Card
            mode={mode}
            key={ret}
            onClick={() =>
              window.open(
                `/${retroInfo?.circle?.slug}?retroSlug=${retroInfo?.slug}`
              )
            }
          >
            <TextBox>
              <Text variant="extraLarge">{retroInfo?.title}</Text>
            </TextBox>
            <Tags>
              <Tag>
                {Object.keys(retroInfo?.circle?.memberRoles).length}{" "}
                participants
              </Tag>
            </Tags>
            <GigInfo>
              <Tag size="medium" hover>
                {retroInfo?.status?.active == true ? "Active" : "Ended"}{" "}
              </Tag>
              <Avatar
                label="profile-pic"
                src={retroInfo?.circle?.avatar}
                address={retroInfo?.circle?.id}
                size="8"
              />
            </GigInfo>
          </Card>
        );
      })}
    </ScrollContainer>
  );
};

export default memo(Retro);

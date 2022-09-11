import { memo } from "react";
import { Box, Text, Tag, Avatar, useTheme } from "degen";
import { UserType, CardDetails } from "@/app/types";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import { ScrollContainer, Card, TextBox, GigInfo, Tags } from "./index";

const Activity = ({ userData }: { userData: UserType }) => {
  const { mode } = useTheme();

  return (
    <ScrollContainer>
      {userData?.assignedCards?.length +
        userData?.reviewingCards?.length +
        userData?.assignedClosedCards?.length +
        userData?.reviewingClosedCards?.length ==
        0 && (
        <Box style={{ margin: "35vh 15vw" }}>
          <Text color="accent" align="center">
            Woah, such empty.
          </Text>
        </Box>
      )}
      {userData?.assignedCards
        ?.slice(0)
        .reverse()
        .map((cardId) => {
          const card: CardDetails = userData?.cardDetails?.[cardId];
          const cardLink = `${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
          return (
            <Card
              mode={mode}
              key={cardId}
              onClick={() => window.open(`/${cardLink}`)}
            >
              <TextBox>
                <Text variant="extraLarge" wordBreak="break-word">
                  {card?.title}
                </Text>
              </TextBox>
              <Tags>
                {card?.labels?.map((tag) => (
                  <Tag as="span" size="small" key={tag}>
                    {tag}
                  </Tag>
                ))}
                {card?.priority > 0 && (
                  <PriorityIcon priority={card?.priority} />
                )}
              </Tags>
              <GigInfo>
                <Tag hover>Working On</Tag>
                <Avatar
                  label="profile-pic"
                  src={card?.circle?.avatar}
                  size="6"
                />
              </GigInfo>
            </Card>
          );
        })}
      {userData?.reviewingCards
        ?.slice(0)
        .reverse()
        .map((cardId) => {
          const card: CardDetails = userData?.cardDetails?.[cardId];
          const cardLink = `${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
          return (
            <Card
              mode={mode}
              key={cardId}
              onClick={() => window.open(`/${cardLink}`)}
            >
              <TextBox>
                <Text variant="extraLarge" wordBreak="break-word">
                  {card?.title}
                </Text>
              </TextBox>
              <Tags>
                {card?.labels?.map((tag) => (
                  <Tag as="span" size="small" key={tag}>
                    {tag}
                  </Tag>
                ))}
                {card?.priority > 0 && (
                  <PriorityIcon priority={card?.priority} />
                )}
              </Tags>
              <GigInfo>
                <Tag hover>Reviewing</Tag>
                <Avatar
                  label="profile-pic"
                  src={card?.circle?.avatar}
                  size="6"
                />
              </GigInfo>
            </Card>
          );
        })}
      {userData?.assignedClosedCards
        ?.slice(0)
        .reverse()
        .map((cardId) => {
          const card: CardDetails = userData?.cardDetails?.[cardId];
          const cardLink = `${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
          return (
            <Card
              mode={mode}
              key={cardId}
              onClick={() => window.open(`/${cardLink}`)}
            >
              <TextBox>
                <Text variant="extraLarge" wordBreak="break-word">
                  {card?.title}
                </Text>
              </TextBox>
              <Tags>
                {card?.labels?.map((tag) => (
                  <Tag as="span" size="small" key={tag}>
                    {tag}
                  </Tag>
                ))}
                {card?.priority > 0 && (
                  <PriorityIcon priority={card?.priority} />
                )}
              </Tags>
              <GigInfo>
                <Tag hover>Worked On</Tag>
                <Avatar
                  label="profile-pic"
                  src={card?.circle?.avatar}
                  size="6"
                />
              </GigInfo>
            </Card>
          );
        })}
      {userData?.reviewingClosedCards
        ?.slice(0)
        .reverse()
        .map((cardId) => {
          const card: CardDetails = userData?.cardDetails?.[cardId];
          const cardLink = `${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
          return (
            <Card
              mode={mode}
              key={cardId}
              onClick={() => window.open(`/${cardLink}`)}
            >
              <TextBox>
                <Text variant="extraLarge" wordBreak="break-word">
                  {card?.title}
                </Text>
              </TextBox>
              <Tags>
                {card?.labels?.map((tag) => (
                  <Tag as="span" size="small" key={tag}>
                    {tag}
                  </Tag>
                ))}
                {card?.priority > 0 && (
                  <PriorityIcon priority={card?.priority} />
                )}
              </Tags>
              <GigInfo>
                <Tag hover>Reviewed</Tag>
                <Avatar
                  label="profile-pic"
                  src={card?.circle?.avatar}
                  size="6"
                />
              </GigInfo>
            </Card>
          );
        })}
    </ScrollContainer>
  );
};

export default memo(Activity);

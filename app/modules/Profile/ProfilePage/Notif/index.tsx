import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Stack, useTheme, Text } from "degen";
import { useState } from "react";
import styled from "styled-components";
import ProfileModal from "../../ProfileSettings";

const Notif = styled(Box)<{ mode: string }>`
  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    margin: 0;
    height: 55vh;
    margin-top: 0.5rem;
    align-items: center;
  }

  width: 18vw;
  height: 22vh;
  margin: 2rem;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0px 1px 6px
    ${(props) =>
      props.mode === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)"};
  &:hover {
    box-shadow: 0px 3px 10px
      ${(props) =>
        props.mode === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.25)"};
    transition-duration: 0.7s;
  }
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  align-items: center;
  position: relative;
  transition: all 0.5s ease-in-out;
`;

const NotifCard = () => {
  const { mode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Notif mode={mode}>
        <Stack>
          <Text variant="base">
            Get notified about new opportunities curated just for you!
          </Text>
          <PrimaryButton variant="secondary" onClick={() => setIsOpen(true)}>
            Turn on Notifications
          </PrimaryButton>
        </Stack>
      </Notif>
      {isOpen && <ProfileModal setIsOpen={setIsOpen} openTab={2} />}
    </>
  );
};

export default NotifCard;

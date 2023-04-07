import Popover from "@/app/common/components/Popover";
import { DiscordRoleMappingType, GuildxyzToCircleRoles } from "@/app/types";
import { Box, Tag, Text, useTheme } from "degen";
import React, { useState } from "react";
import styled from "styled-components";

type Props = {
  roles: {
    id: string;
    name: string;
  }[];
  circleRole: string;
  roleMap: GuildxyzToCircleRoles | DiscordRoleMappingType;
  setRoleMap: (roleMap: GuildxyzToCircleRoles) => void;
};

const PopoverOptionContainer = styled(Box)<{ mode: string }>`
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 20, 20, 0.1)"};
  }
`;

type PopoverOptionProps = {
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  tourId?: string;
};

export const PopoverOption = ({
  children,
  onClick,
  tourId,
}: PopoverOptionProps) => {
  const { mode } = useTheme();

  return (
    <PopoverOptionContainer
      padding="4"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      borderRadius="2xLarge"
      data-tour={tourId}
      mode={mode}
    >
      <Text variant="small" weight="semiBold" ellipsis color="textSecondary">
        {children}
      </Text>
    </PopoverOptionContainer>
  );
};

const RolePopover = ({ setRoleMap, roleMap, circleRole, roles }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      width="fit"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      butttonComponent={
        <Box cursor="pointer" onClick={() => setIsOpen(!isOpen)} padding="1">
          <Tag label="Add" hover>
            <Text>Role</Text>
          </Tag>
        </Box>
      }
    >
      <Box
        backgroundColor="backgroundSecondary"
        borderRadius="2xLarge"
        borderWidth="0.5"
        maxHeight="72"
        overflow="auto"
      >
        {/* <Input label="" placeholder="Search" prefix={<IconSearch />} /> */}
        {roles?.map((role) => (
          <PopoverOption
            onClick={() => {
              if (roleMap[role.id]) {
                setRoleMap({
                  ...roleMap,
                  [role.id]: {
                    ...roleMap[role.id],
                    circleRole: [...roleMap[role.id].circleRole, circleRole],
                  },
                });
              } else {
                setRoleMap({
                  ...roleMap,
                  [role.id]: {
                    circleRole: [circleRole],
                    name: role.name,
                    id: role.id,
                  },
                });
              }
              setIsOpen(false);
            }}
            key={role.id}
          >
            {role.name}
          </PopoverOption>
        ))}
      </Box>
    </Popover>
  );
};

export default RolePopover;

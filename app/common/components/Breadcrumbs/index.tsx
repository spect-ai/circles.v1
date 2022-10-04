import { FC, useState } from "react";
import { Box, IconChevronDown, Stack, Text, useTheme } from "degen";
import styled from "styled-components";
import Popover from "../Popover";
import Link from "next/link";
import { useRouter } from "next/router";

type Crumb = {
  name: string;
  href: string;
};

type CrumbWithChildren = Crumb & {
  children?: Crumb[];
};

interface Props {
  crumbs: CrumbWithChildren[];
}

const Container = styled(Box)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  max-height: 24rem;
`;

const PopoverOptionContainer = styled(Box)<{ mode: string }>`
  &:hover {
    // background-color: rgba(255, 255, 255, 0.1);
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 20, 20, 0.1)"};
  }
`;

type PopoverOptionProps = {
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  tourId?: string;
};

const PopoverOption = ({ children, onClick, tourId }: PopoverOptionProps) => {
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

const DropdownOption = ({ name, href, children }: CrumbWithChildren) => {
  // use state
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <Popover
      butttonComponent={
        <Box
          cursor="pointer"
          onClick={() => setIsOpen(true)}
          paddingTop="0.5"
          paddingX="0.5"
        >
          <Text>
            <IconChevronDown size="5" />
          </Text>
        </Box>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="fit"
    >
      <ScrollContainer
        backgroundColor="background"
        borderWidth="0.5"
        borderRadius="2xLarge"
      >
        {children?.map(({ name, href }) => (
          <PopoverOption
            onClick={() => {
              void router.push(href);
              setIsOpen(false);
            }}
            key={name}
          >
            <Text>{name}</Text>
          </PopoverOption>
        ))}
      </ScrollContainer>
    </Popover>
  );
};

const Breadcrumbs: FC<Props> = ({ crumbs }) => {
  return (
    <Stack direction="horizontal" space="2">
      {crumbs.map((crumb, index) => (
        <Stack direction="horizontal" space="2" key={crumb.href}>
          <Container key={crumb.href}>
            <Text>
              {crumb.href ? (
                <Link href={crumb.href}>{crumb.name}</Link>
              ) : (
                crumb.name
              )}
            </Text>
          </Container>

          {crumb.children && crumb.children?.length > 0 && (
            <DropdownOption {...crumb} />
          )}
          {index !== crumbs.length - 1 && <Text>/</Text>}
        </Stack>
      ))}
    </Stack>
  );
};

export default Breadcrumbs;

export type { Props as BreadcrumbsProps };

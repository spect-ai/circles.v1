import { Box, Button, Stack, Text } from "degen";
import React from "react";

type Props = {
  selectedTab: number;
  onTabClick: (index: number) => void;
  tabs: string[];
  tabTourIds?: string[];
  orientation: "horizontal" | "vertical";
  unselectedColor: "transparent" | "tertiary";
  selectedColor?: "secondary" | "tertiary";
  shape?: string;
  border?: boolean;
  width?: string;
};

export default function Tabs({
  selectedTab,
  onTabClick,
  tabs,
  tabTourIds,
  orientation,
  unselectedColor,
  selectedColor = "tertiary",
  shape = "square",
  border = false,
  width = "full",
}: Props) {
  return (
    <Box
      display="flex"
      width={width as any}
      flexDirection={orientation === "horizontal" ? "row" : "column"}
      borderWidth={border ? "0.5" : "0"}
      borderRadius="3xLarge"
      gap={"2"}
      padding="1"
    >
      {tabs.map((tab, index) => (
        <Box width="full" key={tab}>
          <Button
            data-tour={tabTourIds?.[index]}
            variant={selectedTab === index ? selectedColor : unselectedColor}
            center
            shape={shape as any}
            width="full"
            onClick={() => onTabClick(index)}
            size="extraSmall"
          >
            {tab}
          </Button>
        </Box>
      ))}
    </Box>
  );
}

export function WrappableTabs({
  selectedTab,
  onTabClick,
  tabs,
  tabTourIds,
  orientation,
  unselectedColor,
  selectedColor = "tertiary",
  shape = "square",
  border = false,
  width = "full",
}: Props) {
  return (
    <Box
      display="flex"
      width={width as any}
      flexDirection={orientation === "horizontal" ? "row" : "column"}
      flexWrap={"wrap"}
      borderWidth={border ? "0.5" : "0"}
      borderRadius="3xLarge"
      gap={"2"}
      padding="1"
    >
      {tabs.map((tab, index) => (
        <Box key={tab}>
          <Button
            data-tour={tabTourIds?.[index]}
            variant={selectedTab === index ? selectedColor : unselectedColor}
            center
            shape={shape as any}
            width="full"
            onClick={() => onTabClick(index)}
            size="extraSmall"
          >
            {tab}
          </Button>
        </Box>
      ))}
    </Box>
  );
}

export type { Props as TabsProps };

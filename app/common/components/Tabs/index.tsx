import { Box, Button, Stack, Text } from "degen";
import React from "react";

type Props = {
  selectedTab: number;
  onTabClick: (index: number) => void;
  tabs: string[];
  orientation: "horizontal" | "vertical";
  unselectedColor: "transparent" | "tertiary";
  shape?: string;
  border?: boolean;
};

export default function Tabs({
  selectedTab,
  onTabClick,
  tabs,
  orientation,
  unselectedColor,
  shape = "square",
  border = false,
}: Props) {
  return (
    <Box
      display="flex"
      width="full"
      flexDirection={orientation === "horizontal" ? "row" : "column"}
      borderWidth={border ? "0.5" : "0"}
      borderRadius="3xLarge"
    >
      {tabs.map((tab, index) => (
        <Box width="full" marginX="0.5" key={tab}>
          <Button
            variant={
              selectedTab === index ? "tertiary" : (unselectedColor as any)
            }
            center
            shape={shape as any}
            width="full"
            onClick={() => onTabClick(index)}
            size="small"
          >
            <Text
              color={selectedTab === index ? "textPrimary" : "textTertiary"}
            >
              {tab}
            </Text>
          </Button>
        </Box>
      ))}
    </Box>
  );
}

export type { Props as TabsProps };

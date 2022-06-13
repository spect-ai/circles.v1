import { Box, Button, Text } from "degen";
import React from "react";

type Props = {
  selectedTab: number;
  onTabClick: (index: number) => void;
  tabs: string[];
  orientation: "horizontal" | "vertical";
  unselectedColor: "transparent" | "tertiary";
};

export default function Tabs({
  selectedTab,
  onTabClick,
  tabs,
  orientation,
  unselectedColor,
}: Props) {
  return (
    <Box
      display="flex"
      width="full"
      flexDirection={orientation === "horizontal" ? "row" : "column"}
    >
      {tabs.map((tab, index) => (
        <Box marginRight="4" marginBottom="4" width="full" key={tab}>
          <Button
            variant={
              selectedTab === index ? "secondary" : (unselectedColor as any)
            }
            center
            width="full"
            onClick={() => onTabClick(index)}
            size="small"
          >
            <Text>{tab}</Text>
          </Button>
        </Box>
      ))}
    </Box>
  );
}

export type { Props as TabsProps };

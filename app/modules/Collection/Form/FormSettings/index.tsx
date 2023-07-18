import Tabs from "@/app/common/components/Tabs";
import { Box, Stack } from "degen";
import { useState } from "react";
import styled from "styled-components";
import Access from "./Access";
import General from "./General";
import Archive from "@/app/modules/CollectionProject/Settings/Archive";

function FormSettings() {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <Stack align="center">
      <Box
        padding={{
          xs: "2",
          md: "8",
        }}
        width="2/3"
      >
        <Stack
          direction={{
            xs: "vertical",
            md: "horizontal",
          }}
        >
          <Box
            width={{
              xs: "full",
              md: "1/4",
            }}
            paddingY={{
              xs: "2",
              md: "8",
            }}
            paddingRight={{
              xs: "0",
              md: "1",
            }}
          >
            <Tabs
              selectedTab={selectedTab}
              onTabClick={(tab) => setSelectedTab(tab)}
              tabs={["General", "Access", "Archive"]}
              orientation="vertical"
              unselectedColor="transparent"
            />
          </Box>
          <ScrollContainer
            width={{
              xs: "full",
              md: "3/4",
            }}
            paddingX={{
              xs: "2",
              md: "4",
              lg: "8",
            }}
            paddingY="4"
          >
            {selectedTab === 0 && <General />}
            {selectedTab === 1 && <Access />}
            {selectedTab === 2 && <Archive />}
          </ScrollContainer>
        </Stack>
      </Box>
    </Stack>
  );
}

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 5px;
  }
  height: 32rem;
  overflow-y: auto;
`;

export default FormSettings;

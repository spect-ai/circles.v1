import React from "react";
import { Box, Button, IconCollection, IconEth, Stack, Text } from "degen";
import Accordian from "../../../elements/accordian/Accordian";

export default function TaskSidebar() {
  return (
    <Box borderBottomWidth="0.375">
      <Accordian name="In Progress" defaultOpen>
        <Stack>
          <Button
            // prefix={<IconDocuments />}
            center
            width="full"
            variant="secondary"
            size="small"
          >
            <Text>Update github readme</Text>
          </Button>
          <Button
            // prefix={<IconDocuments />}
            center
            width="full"
            variant="transparent"
            size="small"
          >
            Create the github integration and do that
          </Button>
          <Button
            // prefix={<IconDocuments />}
            center
            width="full"
            variant="transparent"
            size="small"
          >
            Create the discord integration
          </Button>
          <Button
            // prefix={<IconDocuments />}
            center
            width="full"
            variant="transparent"
            size="small"
          >
            Custom tags
          </Button>
          <Button
            // prefix={<IconDocuments />}
            center
            width="full"
            variant="transparent"
            size="small"
          >
            Change the modal to a full screen
          </Button>
        </Stack>
      </Accordian>
      <Accordian name="Project" defaultOpen>
        <Stack>
          <Button
            prefix={<IconCollection />}
            center
            width="full"
            variant="transparent"
            size="small"
          >
            Dev Project
          </Button>
          <Button
            prefix={<IconCollection />}
            center
            width="full"
            variant="transparent"
            size="small"
          >
            Sprint Board
          </Button>
          <Button
            prefix={<IconCollection />}
            center
            width="full"
            variant="transparent"
            size="small"
          >
            Bugs
          </Button>
        </Stack>
      </Accordian>
      <Accordian name="Epoch" defaultOpen>
        <Box paddingY="2">
          <Button
            prefix={<IconEth />}
            center
            width="full"
            variant="transparent"
            size="small"
          >
            Epoch1
          </Button>
        </Box>
      </Accordian>
    </Box>
  );
}

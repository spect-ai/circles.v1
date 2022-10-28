import { Heading, Stack, Text, Button, IconSparkles } from "degen";
import styled from "styled-components";
import { useState } from "react";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { RocketOutlined } from "@ant-design/icons";
import { NameInput } from "./BasicProfile";

export function CreateContent() {
  const [itemName, setItemName] = useState("");
  return (
    <Stack justify={"center"} direction="vertical" align={"center"} space="6">
      <Stack direction={"horizontal"} align="center">
        <IconSparkles color={"accent"} size="8" />
        <Heading>You made it to Spect, WAGMI !</Heading>
      </Stack>
      <Text>So, how should we call you ?</Text>
      <NameInput
        placeholder="swollen-punk"
        value={itemName}
        onChange={(e) => {
          setItemName(e.target.value);
        }}
      />
      <Button
        onClick={()=> {}}
        prefix={<RocketOutlined style={{ fontSize: "1.2rem" }} rotate={30} />}
        variant="secondary"
        size="small"
        disabled={itemName.length == 0}
      >
        Let&apos;s Go
      </Button>
    </Stack>
  )
}
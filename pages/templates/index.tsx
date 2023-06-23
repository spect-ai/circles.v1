import Loader from "@/app/common/components/Loader";
import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Templates from "@/app/modules/Templates";
import { Box, Text } from "degen";
import { NextPage } from "next";
import styled from "styled-components";

const TemplatesPage: NextPage = () => {
  return (
    <>
      <MetaHead
        title={"Template Gallery"}
        description={
          "Connect Discord, Telegram, Github & wallet to your profile & use web3 from web2 platforms."
        }
        image={
          "https://spect.infura-ipfs.io/ipfs/QmcBLdB23dQkXdMKFHAjVKMKBPJF82XkqR5ZkxyCk6aset"
        }
      />
      <DesktopContainer
        backgroundColor="backgroundSecondary"
        id="public-layout"
      >
        <Templates />
      </DesktopContainer>
    </>
  );
};

export default TemplatesPage;

const DesktopContainer = styled(Box)`
  display: flex;
  flexdirection: row;
  height: 100vh;
  overflowy: auto;
  overflowx: hidden;
`;

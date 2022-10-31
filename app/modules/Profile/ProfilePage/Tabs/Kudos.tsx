import { memo, useState, useEffect } from "react";
import styled from "styled-components";
import { UserType, KudoOfUserType } from "@/app/types";
import { Box, Text, useTheme } from "degen";
import useCredentials from "@/app/services/Credentials";
import Image from "next/image";
import { Container, Row, Col } from "react-grid-system";
import OpenseaIcon from "@/app/assets/icons/openseaLogo.svg";
import RaribleIcon from "@/app/assets/icons/raribleLogo.svg";
import { IconButton } from "../../../Project/ProjectHeading";
import { ScrollContainer } from "./index";

const KudoContainer = styled(Box)<{ mode: string }>`
  margin-top: 1rem;
  padding: 0.4rem 1rem 0;
  border-radius: 0.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
  position: relative;
  transition: all 0.3s ease-in-out;
`;

const Kudos = ({ userData }: { userData: UserType }) => {
  const { mode } = useTheme();
  const { getKudosOfUser } = useCredentials();
  const [kudos, setKudos] = useState([] as KudoOfUserType[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData?.ethAddress) {
      setLoading(true);
      getKudosOfUser(userData.ethAddress)
        .then((res) => {
          console.log(res);
          setKudos(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [userData?.ethAddress]);

  return (
    <ScrollContainer>
      {kudos?.length == 0 && !loading && (
        <Box style={{ margin: "35vh 15vw" }}>
          <Text color="accent" align="center">
            No Kudos to show.
          </Text>
        </Box>
      )}
      <Container>
        <Row>
          {!loading &&
            kudos?.length > 0 &&
            kudos?.map((kudo, index) => {
              if (kudo.claimStatus === "claimed")
                return (
                  <Col key={index} xs={12} sm={6} md={6} lg={4}>
                    <KudoContainer mode={mode}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        marginBottom="2"
                        marginTop="2"
                      >
                        <Box>
                          <Image
                            src={kudo.assetUrl}
                            width="100%"
                            height="100%"
                            layout="responsive"
                            objectFit="contain"
                            alt="Kudos img"
                          />
                        </Box>
                        <Box display="flex" flexDirection="row" marginTop="2">
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-start"
                            width="1/2"
                            alignItems="center"
                          >
                            <Text>#{kudo.kudosTokenId}</Text>
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-end"
                            width="1/2"
                          >
                            <IconButton
                              marginRight="2"
                              onClick={() => {
                                window.open(
                                  `https://opensea.io/assets/matic/0x60576A64851C5B42e8c57E3E4A5cF3CF4eEb2ED6/${kudo.kudosTokenId}`,
                                  "_blank"
                                );
                              }}
                            >
                              <OpenseaIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                window.open(
                                  `https://rarible.com/token/polygon/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6:${kudo.kudosTokenId}?tab=overview`,
                                  "_blank"
                                );
                              }}
                            >
                              <RaribleIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </KudoContainer>
                  </Col>
                );
            })}
        </Row>
      </Container>
    </ScrollContainer>
  );
};

export default memo(Kudos);

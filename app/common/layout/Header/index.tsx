import React, { ReactElement, useEffect } from "react";
import { Box, Heading, Stack } from "degen";
import { useRouter } from "next/router";
import { ConnectComponent } from "../ConnectButton";
import { useNetwork, useSigner } from "wagmi";
import { useMutation, useQuery } from "react-query";
import { connectAccount, getUser } from "./api";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3Token = require("web3-token");

function Header(): ReactElement {
  const { activeChain } = useNetwork();
  const { mutate } = useMutation("connectAccount", connectAccount, {
    onSuccess: (res) => console.log({ res }),
  });
  const { data: currentUser } = useQuery<User>("getMyUser", getUser);
  const { data: signer } = useSigner();
  const router = useRouter();
  const { id, bid } = router.query;
  const connect = async (): Promise<void> => {
    const token = await Web3Token.sign(
      async (msg: any) => signer?.signMessage(msg),
      "365d"
    );
    mutate(
      { token, data: "App Login" },
      {
        onSuccess: (res) => {
          console.log({ res });
          localStorage.setItem("web3token", token);
        },
      }
    );
  };

  useEffect(() => {
    if (activeChain?.id && !localStorage.getItem("web3token")) {
      setTimeout(() => {
        connect()
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }, 1000);
    }
  }, [activeChain]);

  // if (globalLoading) {
  //   console.log({ globalLoading });
  //   return (
  //     <Box
  //       display="flex"
  //       flexDirection="row"
  //       borderBottomWidth="0.375"
  //       padding="3"
  //       marginX="4"
  //     >
  //       <Stack direction="horizontal">
  //         <Skeleton loading width="8" height="8" radius="full" />
  //         <Skeleton loading width="40" height="8" />
  //       </Stack>
  //     </Box>
  //   );
  // }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      flexDirection="row"
      borderBottomWidth="0.375"
      padding="3"
      marginX="4"
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        {/* {id && !bid && tribe && (
          <Box marginRight="4">
            <Logo href={`/tribe/${tribe?.teamId}`} src={tribe?.logo} />
          </Box>
        )}
        {id && bid && space?.team && (
          <Box marginRight="4">
            <Logo
              href={`/tribe/${space.team[0].teamId}`}
              src={space.team[0].logo}
            />
          </Box>
        )} */}
        <Heading>{!id && "Tribes"}</Heading>
        {/* <Heading>
          {id && !bid && (
            <Link href={`/tribe/${id}`} passHref>
              {tribe?.name ? tribe.name : '.'}
            </Link>
          )}
        </Heading>
        <Heading>
          {space?.name && bid && (
            <Link href={`/tribe/${id}/space/${bid}`} passHref>
              Dev Project
            </Link>
          )}
        </Heading> */}
        <Box marginLeft="4" />
        {bid && (
          <Stack direction="horizontal">
            {/* <ProjectSettings />
            <PaymentModal /> */}
          </Stack>
        )}
      </Box>
      <Stack direction="horizontal">
        {/* {user?.get('ethAddress') && <ProfileSettings />} */}
        {/* {!user?.get('ethAddress') && (
          <Button
            size="small"
            onClick={async () => {
              const provider = new ethers.providers.Web3Provider(
                window.ethereum
              );
              const signer = provider.getSigner();
              // generating a token with 1 day of expiration time
              const token = await Web3Token.sign(
                async (msg: unknown) => signer.signMessage(msg),
                '365d'
              );
              console.log({ token });
            }}
          >
            Connect
          </Button>
        )} */}
        <ConnectComponent />
      </Stack>
    </Box>
  );
}

export default Header;

import Modal from "@/app/common/components/Modal";
import { PublicLayout } from "@/app/common/layout";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box, Heading } from "degen";
import type { NextPage } from "next";
import { useEffect } from "react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import MetaHead from "../app/common/components/MetaHead/MetaHead";
import styles from "../styles/Home.module.css";

const fetchCircle = async () =>
  await (
    await fetch("http://localhost:3000/circles/62a612ba8fa12efa9ad8f542")
  ).json();

const Home: NextPage = () => {
  const { data, isLoading, isError, error } = useQuery("circle", fetchCircle);
  console.log({ data, isLoading });

  return (
    <>
      <MetaHead />
      <PublicLayout>
        <Box />
      </PublicLayout>
    </>
  );
};

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("circle", fetchCircle);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Home;

import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import MetaHead from "../app/common/components/metaHead/metaHead";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <MetaHead />
      <ConnectButton showBalance={false} chainStatus="icon" />
    </div>
  );
};

export default Home;

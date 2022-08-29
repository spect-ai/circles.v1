import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Circle from "@/app/modules/Circle";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import useConnectDiscordServer from "@/app/services/Discord/useConnectDiscordServer";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

// const CirclePage: NextPage = ({
//   circle,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
const CirclePage: NextPage = () => {
  useConnectDiscordServer();
  const context = useProviderCircleContext();

  return (
    <>
      <MetaHead
        title={"Circle"}
        description={"Circle Description"}
        image={"Circle Avatar"}
      />
      <CircleContext.Provider value={context}>
        <PublicLayout>
          <Circle />
        </PublicLayout>
      </CircleContext.Provider>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { circle: cId } = context.query;
//   const res = await fetch(
//     `${process.env.API_HOST}/circle/slug/${cId as string}`
//   );
//   const data = await res.json();
//   return {
//     props: {
//       circle: data,
//     },
//   };
// };

export default CirclePage;

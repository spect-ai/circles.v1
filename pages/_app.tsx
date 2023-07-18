import { AppProps } from "next/app";
import "@avp1598/react-beautiful-editor/dist/Editor.css";

import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";

import "../styles/globals.css";
import "@/app/styles/DateTimePicker.css";
import "@/app/styles/GanttChart.css";
import "@/app/styles/Table.css";
import "react-toastify/dist/ReactToastify.css";
import "reactflow/dist/style.css";
import "@avp1598/vibes/dist/index.css";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Root = dynamic(() => import("@/app/common/Root"));

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const url = `https:/circles.spect.network/${router.route}`;

  return (
    <Root pageProps={pageProps}>
      <Component {...pageProps} canonical={url} key={url} />
    </Root>
  );
}

export default MyApp;

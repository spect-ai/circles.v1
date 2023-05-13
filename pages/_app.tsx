// import Root from "@/app/common/Root";
import { AppProps } from "next/app";
import { useLocation } from "react-use";

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
import "react-tippy/dist/tippy.css";
import dynamic from "next/dynamic";

const Root = dynamic(() => import("@/app/common/Root"));

function MyApp({ Component, pageProps }: AppProps) {
  const url = useLocation().href;

  return (
    <Root pageProps={pageProps}>
      <Component {...pageProps} canonical={url} key={url} />
    </Root>
  );
}

export default MyApp;

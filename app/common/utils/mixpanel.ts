import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.MIXPANEL_TOKEN || "", {
  debug: true,
  api_host: "https://tracking.spect.network",
  ignore_dnt: true,
});

export default mixpanel;

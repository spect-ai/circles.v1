import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.MIXPANEL_TOKEN || "", {
  debug: true,
  api_host: "https://tracking.spect.network",
});

export default mixpanel;

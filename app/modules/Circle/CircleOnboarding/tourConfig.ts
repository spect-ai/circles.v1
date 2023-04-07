/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/ban-ts-comment */
const tourConfig = [
  {
    selector: '[data-tour="circle-create-folder-button"]',
    content:
      "You can create folders and then create projects, workstreams, retro to start managing tasks among your circle members",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    selector: '[data-tour="circle-options-button"]',
    content: "Click here to see change circle settings",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
    // highlightedSelectors: ['[data-tour="circle-settings-button"]'],
    // mutationObservables: ['[data-tour="circle-settings-button"]'],
    // action: (node: any) => {
    //   // document
    //   //   ?.querySelector(`[data-tour="circle-options-button"]`)
    //   //   // @ts-ignore
    //   //   ?.click();
    //   // node.click();
    //   node.click();
    // },
  },
  {
    selector: '[data-tour="invite-member-button"]',
    content: "Invite members to your circle",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
];

export default tourConfig;

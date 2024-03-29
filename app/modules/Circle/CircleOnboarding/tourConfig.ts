/* eslint-disable @typescript-eslint/ban-ts-comment */
export const tourConfig = [
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
  // {
  //   selector: '[data-tour="circle-settings-button"]',
  //   content: "Open the circle settings",
  //   style: {
  //     backgroundColor: "rgb(20,20,20)",
  //     color: "rgb(255,255,255,0.8)",
  //   },
  //   action: (node: any) => {
  //     // node.click();
  //   },
  // },
  // {
  //   selector: '[data-tour="circle-settings-info"]',
  //   content: "Change circle information",
  //   style: {
  //     backgroundColor: "rgb(20,20,20)",
  //     color: "rgb(255,255,255,0.8)",
  //   },
  //   action: () => {
  //     document
  //       ?.querySelector(`[data-tour="circle-sidebar-settings-button"]`)
  //       // @ts-ignore
  //       ?.click();
  //     // node.click();
  //   },
  //   position: "top",
  // },
  // {
  //   selector: '[data-tour="circle-settings-payments"]',
  //   content:
  //     "Set the default payment to be used for all the cards in this circle.\n Add approvals for the tokens you wish to use",
  //   style: {
  //     backgroundColor: "rgb(20,20,20)",
  //     color: "rgb(255,255,255,0.8)",
  //   },
  //   action: (node: any) => {
  //     node.click();
  //   },
  //   position: "top",
  // },
  // {
  //   selector: '[data-tour="circle-settings-members"]',
  //   content: "See the current contributors of the circle",
  //   style: {
  //     backgroundColor: "rgb(20,20,20)",
  //     color: "rgb(255,255,255,0.8)",
  //   },
  //   action: (node: any) => {
  //     node.click();
  //   },
  //   position: "top",
  // },
  {
    selector: '[data-tour="invite-member-button"]',
    content: "Invite members to your circle",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
];

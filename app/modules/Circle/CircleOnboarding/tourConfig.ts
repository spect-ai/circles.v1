/* eslint-disable @typescript-eslint/ban-ts-comment */
export const tourConfig = [
  {
    selector: '[data-tour="circle-create-project-card"]',
    content:
      "You can create a new project if you want to start managing tasks among your circle members",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    selector: '[data-tour="circle-create-space-card"]',
    content:
      "If you wish to create dedicated workspaces within your circle you can do so by creating a workspace. Each workspace can have their own projects",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    selector: '[data-tour="circle-sidebar-overview-button"]',
    content: "You are currently on the overview page of the circle",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    selector: '[data-tour="circle-sidebar-settings-button"]',
    content: "Click here to open the circle settings",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    selector: '[data-tour="circle-settings-info"]',
    content: "Change circle information",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
    action: () => {
      document
        ?.querySelector(`[data-tour="circle-sidebar-settings-button"]`)
        // @ts-ignore
        ?.click();
      // node.click();
    },
    position: "top",
  },
  {
    selector: '[data-tour="circle-settings-payments"]',
    content:
      "Set the default payment to be used for all the cards in this circle",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
    action: (node: any) => {
      node.click();
    },
    position: "top",
  },
  {
    selector: '[data-tour="circle-settings-members"]',
    content:
      "See the current contributors of the circle and invite more members or change their roles from here",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
    action: (node: any) => {
      node.click();
    },
    position: "top",
  },
];

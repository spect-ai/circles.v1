/* eslint-disable @typescript-eslint/ban-ts-comment */
export const tourConfig = [
  {
    selector: '[data-tour="create-circle-sidebar-button"]',
    content: "You can create your circle from here",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    selector: '[data-tour="profile-header-button"]',
    content: "Change your profile",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    content: "Update your profile info from here",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
    action: () => {
      // by using this, focus trap is temporary disabled
      // @ts-ignore
      document.querySelector(`[data-tour="profile-header-button"]`)?.click();
      // node.click();
    },
  },
  {
    selector: '[data-tour="connect-discord-button"]',
    content:
      "You can connect your discord account, this will be important for you to be able to join circles which have discord role requirement",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    selector: '[data-tour="connect-github-button"]',
    content:
      "You can connect your github account, this is used to link pull requests and issues to your cards",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  // {
  //   selector: '[data-tour="create-card-modal-labels"]',
  //   content: "Add relevant tags to your card",
  //   style: {
  //     backgroundColor: "rgb(20,20,20)",
  //     color: "rgb(255,255,255,0.8)",
  //   },
  // },
];

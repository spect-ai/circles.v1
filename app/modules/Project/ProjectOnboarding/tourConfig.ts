/* eslint-disable @typescript-eslint/ban-ts-comment */
export const tourConfig = [
  {
    selector: '[data-tour="circle-sidebar-overview-button"]',
    content: "You can go back to circle overview from here",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    selector: '[data-tour="circle-sidebar-settings-button"]',
    content: "Change circle settings",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    selector: '[data-tour="circle-sidebar-contributors-button"]',
    content: "View the contributors part of the circle and invite new members",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  // {
  //   selector: '[data-tour="circle-sidebar-create-project-button"]',
  //   content: "Create a new project in the circle",
  //   style: {
  //     backgroundColor: "rgb(20,20,20)",
  //     color: "rgb(255,255,255,0.8)",
  //   },
  // },
  // {
  //   selector: '[data-tour="circle-sidebar-create-space-button"]',
  //   content: "Create a new workspace in the circle",
  //   style: {
  //     backgroundColor: "rgb(20,20,20)",
  //     color: "rgb(255,255,255,0.8)",
  //   },
  // },
  {
    selector: '[data-tour="header-project-settings-button"]',
    content: "Change project level settings from here",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    selector: '[data-tour="header-batch-pay-button"]',
    content: "Execute a batch payment for multiple cards",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    selector: '[data-tour="add-card-column-0-button"]',
    content: "Create a card in this column",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  {
    content: "This opens up the modal to create your card",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
    action: () => {
      // by using this, focus trap is temporary disabled
      // @ts-ignore
      document.querySelector(`[data-tour="add-card-column-0-button"]`)?.click();
      // node.click();
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
  {
    selector: '[data-tour="create-card-modal-type"]',
    content: "Set the card type to bounty if needed",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
  // {
  //   selector: '[data-tour="create-card-modal-assignee"]',
  //   content: "Set the assignee who will work on this card, can be left empty",
  //   style: {
  //     backgroundColor: "rgb(20,20,20)",
  //     color: "rgb(255,255,255,0.8)",
  //   },
  // },
  // {
  //   selector: '[data-tour="create-card-modal-reviewer"]',
  //   content: "Set the reviewer of the card, set to the card creator by default",
  //   style: {
  //     backgroundColor: "rgb(20,20,20)",
  //     color: "rgb(255,255,255,0.8)",
  //   },
  // },
  // {
  //   selector: '[data-tour="create-card-modal-deadline"]',
  //   content: "Set the deadline for the card",
  //   style: {
  //     backgroundColor: "rgb(20,20,20)",
  //     color: "rgb(255,255,255,0.8)",
  //   },
  // },
  // {
  //   selector: '[data-tour="create-card-modal-priority"]',
  //   content: "Set the priority",
  //   style: {
  //     backgroundColor: "rgb(20,20,20)",
  //     color: "rgb(255,255,255,0.8)",
  //   },
  // },
  // {
  //   selector: '[data-tour="create-card-modal-reward"]',
  //   content: "Set the reward using any token",
  //   style: {
  //     backgroundColor: "rgb(20,20,20)",
  //     color: "rgb(255,255,255,0.8)",
  //   },
  // },
  {
    selector: '[data-tour="create-card-modal-button"]',
    content: "Create card once you are finished",
    style: {
      backgroundColor: "rgb(20,20,20)",
      color: "rgb(255,255,255,0.8)",
    },
  },
];

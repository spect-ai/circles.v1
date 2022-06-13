module.exports = {
  // stories: [
  //   {
  //     // 👇 The directory field sets the directory your stories
  //     directory: "../app/common/components/",
  //     // 👇 The titlePrefix field will generate automatic titles for your stories
  //     titlePrefix: "MyComponents",
  //     // 👇 Storybook will load all files that contain the stories extension
  //     files: "*.stories.*",
  //   },
  // ],
  stories: ["../app/common/components/"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },
};

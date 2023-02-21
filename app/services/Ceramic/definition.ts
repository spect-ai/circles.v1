export const definition = {
  models: {
    SpectForm: {
      id: "kjzl6hvfrbw6c5iv52dc4niy6m90mzouxdnp2l1vhk4dghp25uixmcf2wuj3zjt",
      accountRelation: { type: "list" },
    },
  },
  objects: {
    SpectForm: {
      data: { type: "string", required: true },
      link: { type: "string", required: false },
      formId: { type: "string", required: true },
      origin: { type: "string", required: true },
      createdAt: { type: "datetime", required: true },
      author: { type: "view", viewType: "documentAccount" },
    },
  },
  enums: {},
  accountData: { spectFormList: { type: "connection", name: "SpectForm" } },
};

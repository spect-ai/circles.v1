export const definition = {
  models: {
    SpectForm: {
      id: "kjzl6hvfrbw6ca1b5y4fkh5v7mla4a19r8nrwleb6stipcbcnxgjyvk916cnjut",
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

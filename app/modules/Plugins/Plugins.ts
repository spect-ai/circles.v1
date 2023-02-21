export interface SpectPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  docs: string;
  image: string;
  premium: boolean;
}

export const spectPlugins: { [key: string]: SpectPlugin } = {
  guildxyz: {
    id: "guildxyz",
    name: "Role Gating with Guild.xyz",
    version: "1.0.0",
    description:
      "Guild.xyz allows you to role gate forms. Creating an internal form where you only want specific people to respond? This one's for you!",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/GuildOnFire.png?ik-sdk-version=javascript-1.4.3&updatedAt=1675753128685",
    premium: true,
  },
  gtcpassport: {
    id: "gtcpassport",
    name: "Sybil Protection with Gitcoin Passport",
    version: "1.0.0",
    description:
      "Gitcoin Passport allows you to sybil protect your form. Customize passport scores & protect your forms against bots and bad actors!",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/gtcpassport_XqHKx4FMG?ik-sdk-version=javascript-1.4.3&updatedAt=1675753373123",
    premium: true,
  },
  mintkudos: {
    id: "mintkudos",
    name: "Incentivize responders with MintKudos",
    version: "1.0.0",
    description:
      "MintKudos allows you distribute soulbound tokens to responders automatically. Kudos to them for filling out this form!",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/CDfgJBIe_2x.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1675753635232",
    premium: true,
  },
  payments: {
    id: "payments",
    name: "Collect Payments",
    version: "1.0.0",
    description:
      "Create a paywall or take donations directly on your form. Easier than ever!",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/payments.png?ik-sdk-version=javascript-1.4.3&updatedAt=1675753949461",
    premium: true,
  },
  ceramic: {
    id: "ceramic",
    name: "Data Ownership with Ceramic (Testnet Alpha)",
    version: "1.0.0",
    description:
      "Care about data ownership & composability? Use Ceramic to allow your responders to own their data.",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/ceramic.png?ik-sdk-version=javascript-1.4.3&updatedAt=1675754081907",
    premium: true,
  },
  erc20: {
    id: "erc20",
    name: "Distribute ERC20 Tokens to Responders",
    version: "1.0.0",
    description:
      "Want to incentivize responders for filling out your form? Use this plugin to distribute ERC20 tokens to responders!",
    docs: "",
    image:
      "https://ik.imagekit.io/spectcdn/moneybagethereummb3dmodel001.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1676107655114",
    premium: true,
  },
};

export interface SpectPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  docs: string;
  tags: string;
  image: string;
  premium: boolean;
}

export type PluginType =
  | "gtcpassport"
  | "poap"
  | "payments"
  | "ceramic"
  | "erc20"
  | "guildxyz"
  | "mintkudos"
  | "googleCaptcha"
  | "responderProfile"
  | "discordRole"
  | "zealy";

export const spectPlugins: { [key: string]: SpectPlugin } = {
  gtcpassport: {
    id: "gtcpassport",
    name: "Sybil Protection with Gitcoin Passport",
    version: "1.0.0",
    description:
      "Gitcoin Passport allows you to sybil protect your form. Customize passport scores & protect your forms against bots and bad actors!",
    tags: "sybil, passport, gitcoin, gitcoin passport, gitcoin passport, sybil protection",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/gtcpassport_XqHKx4FMG?ik-sdk-version=javascript-1.4.3&updatedAt=1675753373123",
    premium: true,
  },
  poap: {
    id: "poap",
    name: "Create memorable events with POAPs",
    version: "1.0.0",
    description:
      "Commemorating something that matters to you and your frens? Distribute POAPs directly from forms & create a memory that lasts forever!",
    tags: "poap, poaps, poap event, poap events, poap import, poap imports, poap import event, poap import events, surveys, incentivization, incentivize, incentivize responders",
    docs: "https://poap.xyz/",
    image: "https://ik.imagekit.io/spectcdn/poap.png",
    premium: true,
  },
  payments: {
    id: "payments",
    name: "Collect Payments",
    version: "1.0.0",
    description:
      "Create a paywall or take donations directly on your form. Easier than ever!",
    tags: "payments, paywall, donations, collect payments, collect donations, collect payment, collect donation, stripe, stripe payments, stripe payment, stripe donations,",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/payments.png?ik-sdk-version=javascript-1.4.3&updatedAt=1675753949461",
    premium: true,
  },
  // ceramic: {
  //   id: "ceramic",
  //   name: "Data Ownership with Ceramic (Testnet)",
  //   version: "1.0.0",
  //   description:
  //     "Care about data ownership & composability? Use Ceramic to allow your responders to own their data.",
  //   tags: "data ownership, data, ownership, ceramic, decentralized, decentralized data, decentralized data ownership, decentralized data storage, decentralized",
  //   docs: "https://docs.guild.xyz",
  //   image:
  //     "https://ik.imagekit.io/spectcdn/ceramic.png?ik-sdk-version=javascript-1.4.3&updatedAt=1675754081907",
  //   premium: true,
  // },
  erc20: {
    id: "erc20",
    name: "Distribute ERC20 Tokens to Responders (Limited Beta)",
    version: "1.0.0",
    description:
      "Want to incentivize responders for filling out your form? Use this plugin to distribute ERC20 tokens to responders!",
    tags: "erc20, erc20 tokens, erc20 token, erc20 token distribution, incevntivized forms, lottery, lottery forms, lottery form, lottery form distribution, lottery form distributions, airdrop",
    docs: "",
    image:
      "https://ik.imagekit.io/spectcdn/moneybagethereummb3dmodel001.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1676107655114",
    premium: true,
  },
  guildxyz: {
    id: "guildxyz",
    name: "Role Gating with Guild.xyz",
    version: "1.0.0",
    description:
      "Guild.xyz allows you to role gate forms. Creating an internal form where you only want specific people to respond? This one's for you!",
    docs: "https://docs.guild.xyz",
    tags: "role gate, guildxyz, token gate",
    image:
      "https://ik.imagekit.io/spectcdn/GuildOnFire.png?ik-sdk-version=javascript-1.4.3&updatedAt=1675753128685",
    premium: true,
  },
  mintkudos: {
    id: "mintkudos",
    name: "Incentivize responders with MintKudos",
    version: "1.0.0",
    description:
      "MintKudos allows you distribute soulbound tokens to responders automatically. Kudos to them for filling out this form!",
    tags: "distribute tokens, nfts, soul bound tokens, airdrop, incentivize, incentivize responders",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/CDfgJBIe_2x.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1675753635232",
    premium: true,
  },
  googleCaptcha: {
    id: "googleCaptcha",
    name: "Google Captcha",
    version: "1.0.0",
    description:
      "Google Captcha allows you to protect your form from bot attacks!",
    tags: "sybil protection, ddos, sybil, bot protection, bot attacks, bot attack, bot, bots,",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/google-android-apps-100705848-large.webp?ik-sdk-version=javascript-1.4.3&updatedAt=1678260406080",
    premium: true,
  },
  responderProfile: {
    id: "responderProfile",
    name: "Collect Responder Profile",
    version: "1.0.0",
    description:
      "Collect information about the responder. Past experiences, educational achievments, skills along with linked NFTs & credentials!",
    tags: "credential curation, responder info",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/survey_image.png?updatedAt=1681811990898",
    premium: true,
  },
  discordRole: {
    id: "responderProfile",
    name: "Role Gating With Discord Roles",
    version: "1.0.0",
    description:
      "Role gate who can reply to this form with Discord roles. This is ideal if you're looking to share this form with specific groups of people with your community!",
    tags: "credential curation, responder info",
    docs: "",
    image:
      "https://ik.imagekit.io/spectcdn/discord_logo_chaks.png?updatedAt=1682681466430",
    premium: true,
  },
  zealy: {
    id: "zealy",
    name: "Distribute XP on Zealy",
    version: "1.0.0",
    description:
      "Use Zealy to distribute XP to responders and incentivize responders to fill out your form!",
    tags: "incentivization, zealy",
    docs: "",
    image:
      "https://ik.imagekit.io/spectcdn/zealy_xp_chaks.png?updatedAt=1683276390713",
    premium: true,
  },
};

// force

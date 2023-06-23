export interface SpectPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  docs: string;
  tags: string;
  image: string;
  premium: boolean;
  groups: string[];
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
    groups: ["Sybil Protection", "Bot Protection", "Gating", "Onboarding"],
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
    groups: ["Incentivization", "Quiz", "Survey"],
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
    groups: ["Donation", "Paywall"],
  },
  erc20: {
    id: "erc20",
    name: "Distribute ERC20 Tokens to Responders (Limited Access)",
    version: "1.0.0",
    description:
      "Want to incentivize responders for filling out your form? Use this plugin to distribute ERC20 tokens to responders!",
    tags: "erc20, erc20 tokens, erc20 token, erc20 token distribution, incevntivized forms, lottery, lottery forms, lottery form, lottery form distribution, lottery form distributions, airdrop",
    docs: "",
    image:
      "https://ik.imagekit.io/spectcdn/moneybagethereummb3dmodel001.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1676107655114",
    premium: true,
    groups: ["Incentivization", "Quiz", "Survey"],
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
    groups: ["Gating", "Survey", "Feedback"],
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
    groups: ["Incentivization", "Quiz", "Survey"],
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
    groups: ["Bot Protection"],
  },
  responderProfile: {
    id: "responderProfile",
    name: "Whos the Responder?",
    version: "1.0.0",
    description:
      "Collect responders' verified ethereum address, NFT ownerships, community memberships and more!",
    tags: "credential curation, responder info",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/survey_image.png?updatedAt=1681811990898",
    premium: true,
    groups: ["Onboarding", "Survey"],
  },
  discordRole: {
    id: "discordRole",
    name: "Role Gating With Discord Roles",
    version: "1.0.0",
    description:
      "Role gate who can reply to this form with Discord roles. This is ideal if you're looking to share this form with specific groups of people with your community!",
    tags: "credential curation, responder info",
    docs: "",
    image:
      "https://ik.imagekit.io/spectcdn/discord_logo_chaks.png?updatedAt=1682681466430",
    premium: true,
    groups: ["Gating", "Survey", "Feedback"],
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
    groups: ["Incentivization", "Quiz", "Survey"],
  },
};

// force
export function getGroupedPlugins(): { [key: string]: SpectPlugin[] } {
  const groups: { [key: string]: SpectPlugin[] } = {};
  for (const plugin of Object.values(spectPlugins)) {
    for (const group of plugin.groups) {
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(plugin);
    }
  }
  return groups;
}

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
    name: "Guild.xyz",
    version: "1.0.0",
    description:
      "Guild.xyz allows you to role gate your forms. Choose which roles on guild.xyz can access your form.",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/GuildOnFire.png?ik-sdk-version=javascript-1.4.3&updatedAt=1675753128685",
    premium: true,
  },
  gtcpassport: {
    id: "gtcpassport",
    name: "Sybil Protection with GTC Passport",
    version: "1.0.0",
    description:
      "GTC Passport allows you to sybil protect your form. You can set your own score for each passport stamp",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/gtcpassport_XqHKx4FMG?ik-sdk-version=javascript-1.4.3&updatedAt=1675753373123",
    premium: true,
  },
  mintkudos: {
    id: "mintkudos",
    name: "Mint Kudos",
    version: "1.0.0",
    description:
      "Mint Kudos allows you distribute soul bound tokens or 'Kudos' to your form responders",
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
      "Collect payments, paywall form or just accept donations on all supported chains.",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/payments.png?ik-sdk-version=javascript-1.4.3&updatedAt=1675753949461",
    premium: true,
  },
  ceramic: {
    id: "ceramic",
    name: "Ceramic (Coming Soon)",
    version: "1.0.0",
    description:
      "Using ceramic we can store the form responder's data on the decentralized database.",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/ceramic.png?ik-sdk-version=javascript-1.4.3&updatedAt=1675754081907",
    premium: true,
  },
};

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
      "Guild.xyz is a Discord bot that allows you to create a guild website with a custom domain name.",
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
      "GTC Passport is a decentralized identity solution that allows you to prove your identity to other applications.",
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
      "Mint Kudos is a decentralized identity solution that allows you to prove your identity to other applications.",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/CDfgJBIe_2x.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1675753635232",
    premium: true,
  },
  payments: {
    id: "payments",
    name: "Collect Payments",
    version: "1.0.0",
    description: "Collect payments from your members using Stripe.",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/payments.png?ik-sdk-version=javascript-1.4.3&updatedAt=1675753949461",
    premium: true,
  },
  ceramic: {
    id: "ceramic",
    name: "Ceramic",
    version: "1.0.0",
    description:
      "Ceramic is a decentralized identity solution that allows you to prove your identity to other applications.",
    docs: "https://docs.guild.xyz",
    image:
      "https://ik.imagekit.io/spectcdn/ceramic.png?ik-sdk-version=javascript-1.4.3&updatedAt=1675754081907",
    premium: true,
  },
};

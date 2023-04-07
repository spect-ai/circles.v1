import { ComposeClient } from "@composedb/client";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { DIDSession } from "did-session";
import { Connector } from "wagmi";
import definition from "./definition";

export const compose = new ComposeClient({
  ceramic: "https://ceramic-clay.spect.network",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  definition: definition as any,
});

const getStorageKey = (address: string) => `did-session:${address}`;

export const createCeramicSession = async (
  address: string,
  connector: Connector
) => {
  if (address && connector) {
    const ethProvider = await connector.getProvider();

    const accountId = await getAccountId(ethProvider, address);
    const authMethod = await EthereumWebAuth.getAuthMethod(
      ethProvider,
      accountId
    );
    console.warn("👤 Connecting...", accountId);
    const session = await DIDSession.authorize(authMethod, {
      resources: ["ceramic://*"],
      // 30 days sessions
      expiresInSecs: 60 * 60 * 24 * 30,
    });
    // Store the session in local storage
    const sessionString = session.serialize();
    console.warn("👤 Session obtained, serializing", sessionString);
    localStorage.setItem(getStorageKey(address), sessionString);

    return session;
  }
  return null;
};

export const loadCeramicSession = async (address: string) => {
  const sessionString = localStorage.getItem(getStorageKey(address));
  if (sessionString) {
    const session = await DIDSession.fromSession(sessionString);
    if (session && session.hasSession && !session.isExpired) {
      return session;
    }
  }
  return null;
};

import { ComposeClient } from "@composedb/client";
import { definition } from "./definition";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { DIDSession } from "did-session";

export const compose = new ComposeClient({
  ceramic: "https://ceramic-clay.spect.network",
  definition: definition as any,
});

const getStorageKey = (address: string) => `did-session:${address}`;

export const createCeramicSession = async (address: string, connector: any) => {
  if (address && connector) {
    const ethProvider = await connector.getProvider();

    const accountId = await getAccountId(ethProvider, address);
    const authMethod = await EthereumWebAuth.getAuthMethod(
      ethProvider,
      accountId
    );
    console.log("👤 Connecting...", accountId);
    const session = await DIDSession.authorize(authMethod, {
      resources: [`ceramic://*`],
      // 30 days sessions
      expiresInSecs: 60 * 60 * 24 * 30,
    });
    console.log({ session });

    // Store the session in local storage
    const sessionString = session.serialize();
    console.log("👤 Session obtained, serializing", sessionString);
    localStorage.setItem(getStorageKey(address), sessionString);

    return session;
  }
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

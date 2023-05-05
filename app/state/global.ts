import { atom } from "jotai";

export const authStatusAtom =
  atom<"loading" | "authenticated" | "unauthenticated">("loading");

export const scribeOpenAtom = atom(false);
export const scribeUrlAtom = atom("");

export const connectedUserAtom = atom("");

export const isSidebarExpandedAtom = atom(false);
export const isProfilePanelExpandedAtom = atom(false);
export const quickProfileUserAtom = atom("");

export const userDataAtom = atom({} as any);
export const profileLoadingAtom = atom(false);

import { atom } from "jotai";
import { Socket } from "socket.io-client";
import { UserType } from "../types";

export const authStatusAtom =
  atom<"loading" | "authenticated" | "unauthenticated">("loading");

export const scribeOpenAtom = atom(false);
export const scribeUrlAtom = atom("");

export const socketAtom = atom<Socket | null>(null);

export const connectedUserAtom = atom("");

export const isSidebarExpandedAtom = atom(false);
export const isProfilePanelExpandedAtom = atom(false);
export const quickProfileUserAtom = atom("");

export const userDataAtom = atom<UserType>({} as UserType);
export const profileLoadingAtom = atom(false);

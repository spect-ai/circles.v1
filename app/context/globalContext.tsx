import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";
import { Registry } from "../types";

interface GlobalContextType {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (isSidebarExpanded: boolean) => void;
  registry: Registry;
  connectedUser: string;
  connectUser: (userId: string) => void;
  disconnectUser: () => void;
}

const useProviderGlobalContext = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [registry, setRegistry] = useState<Registry>({} as Registry);
  const [connectedUser, setConnectedUser] = useState("");

  function connectUser(userId: string) {
    setConnectedUser(userId);
  }
  const disconnectUser = () => {
    setConnectedUser("");
  };

  useEffect(() => {
    fetch(`${process.env.API_HOST}/registry/getGlobalRegistry`)
      .then(async (res) => {
        const data = await res.json();
        setRegistry(data);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, []);

  return {
    isSidebarExpanded,
    setIsSidebarExpanded,
    registry,
    connectedUser,
    connectUser,
    disconnectUser,
  };
};

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const useGlobal = () => useContext(GlobalContext);

function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const context = useProviderGlobalContext();

  return (
    <GlobalContext.Provider value={context}>{children}</GlobalContext.Provider>
  );
}

export default memo(GlobalContextProvider);

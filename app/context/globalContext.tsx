import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Registry } from "../types";

interface GlobalContextType {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (isSidebarExpanded: boolean) => void;
  registry: Registry;
  setRegistry: (registry: Registry) => void;
  connectedUser: string;
  setConnectedUser: (connectedUser: string) => void;
  // connectUser: (userId: string) => void;
  // disconnectUser: () => void;
}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalContext");
  }
  const {
    setConnectedUser,
    setRegistry,
    isSidebarExpanded,
    setIsSidebarExpanded,
    registry,
    connectedUser,
  } = context;

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

function GlobalContextProvider(props: any) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [registry, setRegistry] = useState<Registry>({} as Registry);
  const [connectedUser, setConnectedUser] = useState("");

  const value = useMemo(() => {
    return {
      isSidebarExpanded,
      setIsSidebarExpanded,
      registry,
      setRegistry,
      connectedUser,
      setConnectedUser,
    };
  }, [isSidebarExpanded, registry, connectedUser]);

  return <GlobalContext.Provider value={value} {...props} />;
}

export { GlobalContextProvider, useGlobal };

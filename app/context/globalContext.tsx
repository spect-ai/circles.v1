import React, { createContext, useContext, useEffect, useState } from "react";
import { Registry } from "../types";

interface GlobalContextType {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (isSidebarExpanded: boolean) => void;
  registry: Registry;
}

const useProviderGlobalContext = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [registry, setRegistry] = useState<Registry>({} as Registry);

  useEffect(() => {
    fetch("http://localhost:3000/registry/getGlobalRegistry")
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
  };
};

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const useGlobalContext = () => useContext(GlobalContext);

function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const context = useProviderGlobalContext();

  return (
    <GlobalContext.Provider value={context}>{children}</GlobalContext.Provider>
  );
}

export default GlobalContextProvider;

import React, { ReactNode, createContext } from "react";
import API from "../API/API";

const ApiContext = createContext<{
  api?: API;
}>({});

const ApiContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // const client: V6Client<Schema> = generateClient<Schema>();
  const api = new API();

  return <ApiContext.Provider value={{ api }}>{children}</ApiContext.Provider>;
};

export { ApiContext, ApiContextProvider };

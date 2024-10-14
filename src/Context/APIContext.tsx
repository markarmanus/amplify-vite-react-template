import React, { ReactNode, createContext } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { V6Client } from "@aws-amplify/api-graphql";
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

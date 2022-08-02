import { createContext, useContext } from "react";
import { ContractConfig } from "../../contracts";

export const Contract = createContext(null as ContractConfig | null);

export const useContractConfig = () => {
  const contractConfig = useContext(Contract);
  if (!contractConfig) {
    throw new Error("No contract config provided");
  }
  return contractConfig;
};

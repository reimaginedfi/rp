import { createContext, useContext } from "react";
import { useContractRead } from "wagmi";
import { ContractConfig } from "../../contracts";

export type ReadVaultOpts = Omit<
  Parameters<typeof useContractRead>[0],
  "functionName" | "addressOrName" | "contractInterface"
>;
export type WatchVaultOpts = Omit<
  Parameters<typeof useContractRead>[0],
  "functionName" | "addressOrName" | "contractInterface" | "watch"
>;

export const Contract = createContext(null as ContractConfig | null);

export const useContractConfig = () => {
  const contractConfig = useContext(Contract);
  if (!contractConfig) {
    throw new Error("No contract config provided");
  }
  return contractConfig;
};

export const useReadVault = (functionName: string, opts?: ReadVaultOpts) => {
  const contractConfig = useContractConfig();
  const readResult: any = useContractRead({
    ...contractConfig,
    ...opts,
    functionName,
  });
  return readResult;
};

export const useWatchVault = (functionName: string, opts?: WatchVaultOpts) => {
  const contractConfig = useContractConfig();
  const readResult: any = useContractRead({
    ...contractConfig,
    ...opts,
    functionName,
    watch: true,
  });
  return readResult;
};

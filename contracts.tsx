import type { GetContractArgs } from "@wagmi/core";
import { chain } from "wagmi";
import vaultContractInterface from "./abi/vault.abi.json";

export type ContractConfig = GetContractArgs;

interface ContractsMap {
  [chainId: number]: ContractConfig[];
}

export const vaults: ContractsMap = {
  [chain.rinkeby.id]:
    process.env.NODE_ENV === "production"
      ? []
      : [
          {
            addressOrName: "0x4f68ece2773e8694467d7e6119a0bef860b75d7f",
            contractInterface: vaultContractInterface.abi,
          },
        ],
  [chain.mainnet.id]: [
    {
      addressOrName: "0x00008F4A977ce3324b2b09E3e927F52BCf156E85",
      contractInterface: vaultContractInterface.abi,
    },
  ],
};

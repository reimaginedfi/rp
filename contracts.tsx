import type { GetContractArgs } from "@wagmi/core";
import { chain } from "wagmi";
import vaultContractInterface from "./abi/vault.abi.json";
import configContractInterface from "./abi/vaultconfig.abi.json";

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
  // [chain.mainnet.id]: [
  //   {
  //     addressOrName: "0x00000008786611c72a00909bd8d398b1be195be3",
  //     contractInterface: vaultContractInterface.abi,
  //   },
  // ],
  [chain.mainnet.id]: [
    {
      addressOrName: "0x63bBB71B68c76B78243d0a4AA463D34536788A15",
      contractInterface: vaultContractInterface.abi,
    }
  ]
};

export const vaultConfigs: ContractsMap = {
  [chain.mainnet.id]: [
    {
      addressOrName: "0x00000997e18087b2477336fe87B0c486c6A2670D",
      contractInterface: configContractInterface.abi,
    },
  ],
};

import type { GetContractArgs } from "@wagmi/core";
import { ContractInterface } from "ethers";
// import { chain } from "wagmi";
import vaultContractInterface from "./abi/vault.abi.json";
import configContractInterface from "./abi/vaultconfig.abi.json";

export type ContractConfig = GetContractArgs;

interface ContractsMap {
  id: number;
  name?: string;
  address: string;
  contractInterface: ContractInterface;
}

// export const vaults: ContractsMap[] = [
  // [chain.rinkeby.id]:
  //   process.env.NODE_ENV === "production"
  //     ? []
  //     : [
  //         {
  //           addressOrName: "0x4f68ece2773e8694467d7e6119a0bef860b75d7f",
  //           contractInterface: vaultContractInterface.abi,
  //         },
  //       ],
  // [chain.mainnet.id]: [
  //   {
  //     addressOrName: "0x00000008786611c72a00909bd8d398b1be195be3",
  //     contractInterface: vaultContractInterface.abi,
  //   },
  // ]
    // {
    //   addressOrName: "0x63bBB71B68c76B78243d0a4AA463D34536788A15",
    //   contractInterface: vaultContractInterface.abi,
    // }
//   ],
// };

export const vaults: ContractsMap[] = [
    {
      id: 1,
      name: "USDC RP Vault",
      address: "0x00000008786611c72a00909bd8d398b1be195be3",
      contractInterface: vaultContractInterface.abi,
    },
    // {
    //   id: 2,
    //   name: "Mock USDC RP Vault",
    //   addressOrName: "0x63bBB71B68c76B78243d0a4AA463D34536788A15",
    //   contractInterface: vaultContractInterface.abi,
    // }
  ]

export const vaultConfigs: ContractsMap[] = [
    {
      id: 1,
      name: "Main Vault Config",
      address: "0x00000997e18087b2477336fe87B0c486c6A2670D",
      contractInterface: configContractInterface.abi,
    },
  ]
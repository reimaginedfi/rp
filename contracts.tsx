import type { GetContractArgs } from "@wagmi/core";
// import { ContractInterface } from "ethers";
// import { chain } from "wagmi";
import vaultContractInterface from "./abi/vault.abi.json";
import configContractInterface from "./abi/vaultconfig.abi.json";

// export type ContractConfig = GetContractArgs;

export interface ContractsMap {
  id: number;
  name?: string;
  address: `0x${string}`;
  abi: any;
  token?: `0x${string}`;
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
      abi: vaultContractInterface,
      token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    // {
    //   id: 2,
    //   name: "Mock USDC RP Vault",
    //   address: "0x63bBB71B68c76B78243d0a4AA463D34536788A15",
    //   abi: vaultContractInterface,
    //   token: "0x24eB7F255a9FE448940234bF74d95C8925ebd753",
    // }
  ]

export const vaultConfigs: ContractsMap[] = [
    {
      id: 1,
      name: "Main Vault Config",
      address: "0x00000997e18087b2477336fe87B0c486c6A2670D",
      abi: configContractInterface,
    },
  ]
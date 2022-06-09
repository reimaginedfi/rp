import { erc20ABI } from "wagmi";
import mockUnderlyingAbi from "./abi/underlying.abi.json";
import vaultContractInterface from "./abi/vault.abi.json";

export const mockUnderlying = {
  addressOrName: "0x1613beb3b2c4f22ee086b2b38c1476a3ce7f78e8",
  contractInterface: mockUnderlyingAbi.abi,
};

export const vault = {
  addressOrName: "0x851356ae760d987e095750cceb3bc6014560891c",
  contractInterface: vaultContractInterface.abi,
};

const assets = {
  hardhat: {
    mockUSDC: mockUnderlying,
  },
  rinkeby: {
    mockUSDC: {
      addressOrName: "0x81f2ecc087d3e5499251cda8960d6b44997c959e",
      contractInterface: mockUnderlyingAbi.abi,
    },
    dai: {
      addressOrName: "0x6A9865aDE2B6207dAAC49f8bCba9705dEB0B0e6D",
      contractInterface: erc20ABI,
    },
  },
};

const vaults = {
  hardhat: {
    stableVault: vault,
  },
  rinkeby: {
    stablevault: {
      addressOrName: "0x4f68ece2773e8694467d7e6119a0bef860b75d7f",
      contractInterface: vaultContractInterface.abi,
    },
  },
};

export function getVault(CHAIN = "rinkeby") {
  const chain = CHAIN.toLocaleLowerCase();
  return chain in vaults ? vaults[chain as keyof typeof vaults] : vault;
}

export function getAsset(CHAIN = "rinkeby") {
  const chain = CHAIN.toLocaleLowerCase();
  return chain in assets
    ? assets[chain as keyof typeof assets]
    : mockUnderlying;
}

export const RINKEBY_STABLE_VAULT_ADDRESS =
  "0x4f68ece2773e8694467d7e6119a0bef860b75d7f";
export const RINKEBY_STABLE_VAULT = {
  addressOrName: RINKEBY_STABLE_VAULT_ADDRESS,
  contractInterface: vaultContractInterface.abi,
};
export type StableVaultType = typeof RINKEBY_STABLE_VAULT;

import { BigNumber, constants } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useMemo } from "react";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useToken,
} from "wagmi";
import vaultContractInterface from "../../abi/vault.abi.json";
import { ContractConfig } from "../../contracts";

// export const useVault = (addressOrName: string) => {
//   const vault = useMemo(() => {
//     return {
//       addressOrName,
//       contractInterface: vaultContractInterface.abi,
//     };
//   }, [addressOrName]);
//   return { vault };
// };

export const useVaultMeta = (contractConfig: ContractConfig) => {
  const asset = useContractRead({
    ...contractConfig,
    functionName: "asset",
  });
  const assetToken = useToken({
    address: asset.data?.toString(),
  });
  const aum = useContractRead({
    ...contractConfig,
    functionName: "aum",
    watch: true,
  });
  const epoch = useContractRead({
    ...contractConfig,
    functionName: "epoch",
    watch: true,
  });
  const farmer = useContractRead({
    ...contractConfig,
    functionName: "farmer",
  });

  const aumCap = useContractRead({
    ...contractConfig,
    functionName: "aumCap",
  });

  const vaultName = useContractRead({
    ...contractConfig,
    functionName: "name",
  });

  return {
    asset,
    assetToken,
    aum,
    epoch,
    farmer,
    aumCap,
    vaultName,
  };
};

export const useVaultUser = (
  contractConfig: ContractConfig,
  vaultUserAddress: string
) => {
  const user = useContractRead({
    ...contractConfig,
    functionName: "vaultUsers",
    watch: true,
    args: [vaultUserAddress],
  });

  const sharesValue = useContractRead({
    ...contractConfig,
    functionName: "previewRedeem",
    args: [user.data?.vaultShares],
  });

  const hasPendingDeposit = useContractRead({
    ...contractConfig,
    functionName: "userHasPendingUpdate",
    args: [vaultUserAddress],
    watch: true,
  });

  return {
    user,
    sharesValue,
    hasPendingDeposit,
  };
};

export const useVaultDeposit = (
  contractConfig: ContractConfig,
  depositAmount: string
) => {
  const { assetToken } = useVaultMeta(contractConfig);
  const { address } = useAccount();

  const { data: balance } = useContractRead({
    addressOrName: assetToken.data?.address ?? "",
    contractInterface: erc20ABI,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  const balanceDisplay = formatUnits(
    balance ?? 0,
    assetToken.data?.decimals ?? 0
  );

  const { data: allowance } = useContractRead({
    addressOrName: assetToken.data?.address ?? "",
    contractInterface: erc20ABI,
    functionName: "allowance",
    args: [address, contractConfig.addressOrName],
    watch: true,
  });

  const isAllowed =
    BigNumber.isBigNumber(allowance) &&
    allowance.gte(parseUnits(depositAmount) ?? "0");

  const { write: approve, isLoading: isApproving } = useContractWrite({
    addressOrName: assetToken.data?.address ?? "",
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [contractConfig.addressOrName, parseUnits(depositAmount)],
  });

  const { write: approveMax, isLoading: isApprovingMax } = useContractWrite({
    addressOrName: assetToken.data?.address ?? "",
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [contractConfig.addressOrName, constants.MaxUint256],
  });
  const { write: storeAsset, isLoading: isStoring } = useContractWrite({
    ...contractConfig,
    functionName: "storeAssetForDeposit",
    args: [parseUnits(depositAmount)],
    overrides: {
      gasLimit: 150000,
    },
  });

  return {
    balance,
    balanceDisplay,
    allowance,
    isAllowed,
    approve,
    isApproving,
    approveMax,
    isApprovingMax,
    storeAsset,
    isStoring,
  };
};

export const useVaultWithdraw = (
  contractConfig: ContractConfig,
  unlockAmount: string
) => {
  const { address } = useAccount();
  const userHasPendingRedeem = useContractRead({
    ...contractConfig,
    functionName: "userHasPendingRedeem",
    watch: true,
    args: [address ?? ""],
  });

  const { user } = useVaultUser(contractConfig, address ?? "");

  const unlockShares = useContractWrite({
    ...contractConfig,
    functionName: "unlockShareForRedeem",
    args: [parseUnits(unlockAmount)],
  });
  const hasPendingWithdrawal = userHasPendingRedeem.data;

  return {
    hasPendingWithdrawal,
    user,
    unlockShares,
  };
};

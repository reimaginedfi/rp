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
    functionName: "userHasPendingDeposit",
    args: [vaultUserAddress],
    watch: true,
  });

  return {
    user,
    sharesValue,
    hasPendingDeposit,
    hasPendingDepositValue:
      hasPendingDeposit.data ||
      (BigNumber.isBigNumber(user.data?.[1]) &&
        BigNumber.from(user.data?.[1]).gt(0)),
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
    args: [address, contractConfig?.addressOrName],
    watch: true,
  });

  const isAllowed =
    BigNumber.isBigNumber(allowance) &&
    allowance.gte(parseUnits(depositAmount, assetToken.data?.decimals) ?? "0");

  const {
    write: approve,
    isLoading: isApproving,
    error: approveError,
    status: approveStatus,
  } = useContractWrite({
    addressOrName: assetToken.data?.address ?? "",
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [
      contractConfig?.addressOrName,
      parseUnits(depositAmount, assetToken.data?.decimals),
    ],
  });

  const {
    write: approveMax,
    isLoading: isApprovingMax,
    error: approveMaxError,
    status: approveMaxStatus,
  } = useContractWrite({
    addressOrName: assetToken.data?.address ?? "",
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [contractConfig?.addressOrName, constants.MaxUint256],
  });

  const {
    write: storeAsset,
    isLoading: isStoring,
    error: storeAssetError,
    status: storeAssetStatus,
  } = useContractWrite({
    ...contractConfig,
    functionName: "deposit",
    args: [parseUnits(depositAmount, assetToken.data?.decimals)],
    overrides: {
      gasLimit: 300000,
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
    approveError,
    approveMaxError,
    storeAssetError,
    approveStatus,
    approveMaxStatus,
    storeAssetStatus,
  };
};

export const useVaultWithdraw = (
  contractConfig: ContractConfig,
  unlockAmount: string
) => {
  const { address } = useAccount();
  const { assetToken } = useVaultMeta(contractConfig);
  const userHasPendingRedeem = useContractRead({
    ...contractConfig,
    functionName: "userHasPendingRedeem",
    watch: true,
    args: [address ?? ""],
  });

  const { user } = useVaultUser(contractConfig, address ?? "");

  const {
    write: unlockShares,
    isLoading: unlockingShares,
    error: unlockingError,
    isSuccess: unlockingSuccess,
    status: unlockingStatus,
  } = useContractWrite({
    ...contractConfig,
    functionName: "unlock",
    args: [parseUnits(unlockAmount, assetToken.data?.decimals)],
  });
  const hasPendingWithdrawal = userHasPendingRedeem.data;

  const { data: withdrawable } = useContractRead({
    ...contractConfig,
    functionName: "previewClaim",
    args: [address],
  });

  const {
    write: claim,
    isLoading: claiming,
    error: claimError,
    isSuccess: claimSuccess,
    status: claimStatus,
  } = useContractWrite({
    ...contractConfig,
    functionName: "withdraw",
  });

  return {
    hasPendingWithdrawal,
    user,
    unlockShares,
    unlockingShares,
    unlockingError,
    withdrawable,
    claim,
    claiming,
    claimError,
    claimSuccess,
    unlockingSuccess,
    claimStatus,
    unlockingStatus,
  };
};

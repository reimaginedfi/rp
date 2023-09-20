import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { commify  } from "ethers/lib/utils";
import { formatUnits, parseUnits } from 'viem'
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useToken,
  useWaitForTransaction,
} from "wagmi";
import { ContractsMap } from "../../contracts";
import { useContractConfig } from "../Vault/ContractContext";
import { noSpecialCharacters } from "../utils/stringsAndNumbers";
import { useEffect } from "react";
import vaultContractInterface from "../../abi/vault.abi.json";

import { truncate } from "../utils/stringsAndNumbers";

// export const useVault = (addressOrName: string) => {
//   const vault = useMemo(() => {
//     return {
//       addressOrName,
//       contractInterface: vaultContractInterface.abi,
//     };
//   }, [addressOrName]);
//   return { vault };
// };

export const useVaultMeta = (contractConfig: ContractsMap) => {
  const asset: any = useContractRead({
    ...contractConfig as any,
    functionName: "asset",
  });

  const assetToken = useToken({
    address: asset.data?.toString() as `0x${string}`,
  });
  const aum: any = useContractRead({
    ...contractConfig as any,
    functionName: "aum",
    watch: true,
  });
  const epoch: any = useContractRead({
    ...contractConfig as any,
    functionName: "epoch",
    watch: true,
  });
  const farmer: any = useContractRead({
    ...contractConfig as any,
    functionName: "farmer",
  });

  const aumCap: any = useContractRead({
    ...contractConfig as any,
    functionName: "aumCap",
    watch: true,
  });

  const vaultName: any = useContractRead({
    ...contractConfig as any,
    functionName: "name",
  });

  const storedFee: any = useContractRead({
    ...contractConfig as any,
    functionName: "storedFee",
    watch: true,
  });

  const maxDeposit: any = useContractRead({
    ...contractConfig as any,
    functionName: "getMaxDeposit",
    watch: true,
  });

  return {
    asset,
    assetToken,
    aum,
    epoch,
    farmer,
    aumCap,
    vaultName,
    storedFee,
    maxDeposit,
  };
};

type User = {
  assetsDeposited: string;
  epochLastDeposited: string;
  vaultShares: string;
  sharesToRedeem: string;
  epochToRedeem: string;
}

export const useVaultUser = (
  contractConfig: ContractsMap,
  vaultUserAddress: string
) => {
  // console.log(contractConfig)

  const user: any = useContractRead({
    address: contractConfig?.address,
    abi: vaultContractInterface,
    functionName: "vaultUsers",
    watch: true,
    args: [vaultUserAddress],
  });

  // console.log(user)

  const sharesValue: any = useContractRead({
    address: contractConfig?.address,
    abi: vaultContractInterface,
    functionName: "previewRedeem",
    args: [user.data?.[2]!],
  });

  const hasPendingDeposit: any = useContractRead({
    address: contractConfig?.address,
    abi: vaultContractInterface,
    functionName: "userHasPendingDeposit",
    args: [vaultUserAddress],
    watch: true,
  });

  const updatePendingDeposit = useContractWrite({
    address: contractConfig?.address,
    abi: vaultContractInterface,
    functionName: "updatePendingDepositState",
    args: [vaultUserAddress],
    // mode: "recklesslyUnprepared",
  });

  const totalDeposited = user.data && Number(user.data[0]) === 0 ? Number(user.data[0]) : 0;

  const hasPendingWithdrawal: any = useContractRead({
    address: contractConfig?.address,
    abi: vaultContractInterface,
    functionName: "userHasPendingWithdrawal",
    args: [vaultUserAddress],
    watch: true,
  });

  return {
    user,
    sharesValue,
    hasPendingDeposit,
    hasPendingDepositValue:
      hasPendingDeposit.data || 
      Number(user.data?.[1]) === 0 ? 0 : Number(user.data?.[1]),
    totalDeposited,
    updatePendingDeposit,
    hasPendingWithdrawal
  };
};

export const useVaultDeposit = (
  contractConfig: ContractsMap,
  depositAmount: number,
  _for?: string
) => {
  const { assetToken } = useVaultMeta(contractConfig);
  const { address } = useAccount();
  const addRecentTransaction = useAddRecentTransaction();

  const { data: balance } = useContractRead({
    address: assetToken.data?.address as `0x${string}` ?? "",
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}` ?? ""],
    watch: true,
  });
  // console.log(assetToken.data?.address)
  // console.log(balance && Number(balance!.toString()))

  const balanceDisplay = formatUnits(
    balance ?? BigInt(0),
    assetToken.data?.decimals ?? 0
  );

  // console.log(balanceDisplay)

  const { data: allowance } = useContractRead({
    address: assetToken.data?.address as `0x${string}` ?? "",
    abi: erc20ABI,
    functionName: "allowance",
    args: [address as `0x${string}`, contractConfig?.address as `0x${string}`],
    watch: true,
  });

  const isApproved = Number(allowance!) >= Number(parseUnits(noSpecialCharacters(depositAmount.toString()), assetToken.data?.decimals!));

    // console.log(assetToken.data?.address)
    // console.log(Number(allowance));
    // console.log(Number(parseUnits(noSpecialCharacters(depositAmount.toString()), assetToken.data?.decimals!)))

  const {
    data: approveData,
    write: approve,
    isLoading,
    error: approveError,
    status: approveStatus,
  } = useContractWrite({
    address: assetToken.data?.address as `0x${string}` ?? "",
    abi: erc20ABI,
    functionName: "approve",
    // mode: "recklesslyUnprepared",
    args: [
      contractConfig?.address as `0x${string}` ?? "",
      parseUnits(noSpecialCharacters(depositAmount.toString()), assetToken.data?.decimals!),
    ],
    onSuccess(data: any, variables: any, context: any) {
      addRecentTransaction({
        hash: data?.hash,
        description: `Approve REFI Pro to spend ${commify(
          noSpecialCharacters(depositAmount.toString())
        )} USDC`,
        confirmations: 1,
      });
    },
  });
  const { isLoading: isApproving } = useWaitForTransaction(approveData);

  // const approve = async () => {
  //   rawApprove();

  //     addRecentTransaction({
  //       hash: approveData?.hash,
  //     });

  // }

  const maxUint256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")

  const {
    write: approveMax,
    isLoading: isApprovingMax,
    error: approveMaxError,
    status: approveMaxStatus,
  } = useContractWrite({
    address: assetToken.data?.address as `0x${string}` ?? "",
    abi: erc20ABI,
    functionName: "approve",
    args: [contractConfig?.address as `0x${string}`, maxUint256],
    // mode: "recklesslyUnprepared",
  });

  const {
    write: storeAsset,
    isLoading: isStoring,
    error: storeAssetError,
    status: storeAssetStatus,
    data: depositData,
    status,
    error,
  } = useContractWrite({
    ...contractConfig as any,
    functionName: "deposit",
    args: [
      parseUnits(noSpecialCharacters(depositAmount.toString()), assetToken.data?.decimals!),
    ],

    onSuccess(data: any, variables: any, context: any) {
      addRecentTransaction({
        hash: data?.hash,
        description: `Deposit ${commify(
          noSpecialCharacters(depositAmount.toString())
        )} USDC`,
        confirmations: 1,
      });
    },
    // mode: "recklesslyUnprepared",
    onSettled(data: any, error: any, variables: any, context: any) {
      console.log({ data });
      console.log({ error });
      console.log({ variables });
      console.log({ context });
    },
    gas: BigInt(1000000),
  });

  const depositFor = useContractWrite({
    ...contractConfig as any,
    functionName: "deposit",
    args: [
      parseUnits(noSpecialCharacters(depositAmount.toString()), assetToken.data?.decimals!),
      _for,
    ],
    // mode: "recklesslyUnprepared",
  });

  return {
    balance,
    balanceDisplay,
    allowance,
    isApproved,
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
    depositData,
    depositFor,
    approveData,
  };
};

export const useVaultWithdraw = (
  contractConfig: ContractsMap,
  unlockAmount: string
) => {
  useEffect(() => {
    console.log("unlockAmount", unlockAmount);
  }, [unlockAmount]);
  const { address } = useAccount();
  // const address = "0x0D069084ad2f05A4C2c5bcf1a80dB7d1c95730EC"
  const { assetToken } = useVaultMeta(contractConfig);

  const hasPendingWithdrawal: any = useContractRead({
    ...contractConfig as any,
    functionName: "userHasPendingWithdrawal",
    watch: true,
    args: [address ?? ""],
  });

  const userHasPendingDeposit: any = useContractRead({
    ...contractConfig as any,
    functionName: "userHasPendingDeposit",
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
    data: unlockData,
  } = useContractWrite({  ...contractConfig as any,
    functionName: "unlock",
    args: [
      parseUnits(Math.trunc(Number(unlockAmount)).toString(), 6),
    ]});

  const withdrawable: any = useContractRead({
    ...contractConfig as any,
    functionName: "getWithdrawalAmount",
    args: [address ?? ""],
  });

  // console.log("LETSGO", withdrawable)

  // console.log(userHasPendingDeposit);

  // const { config: withdrawConfig } = usePrepareContractWrite({
  //   ...contractConfig,
  //   functionName: "withdraw",
  //   overrides: {
  //     gasLimit: 500000,
  //   },
  // });

  const {
    write: claim,
    isLoading: claiming,
    error: claimError,
    isSuccess: claimSuccess,
    status: claimStatus,
    data: claimData,
  } = useContractWrite({
    ...contractConfig as any,
    functionName: "withdraw",
    gas: BigInt(500000),
    // mode: "recklesslyUnprepared",
  });

  // const {
  //   // write: claim,
  //   // isLoading: claiming,
  //   // error: claimError,
  //   // isSuccess: claimSuccess,
  //   // status: claimStatus,
  //   // data: claimData,
  // } = useContractWrite({
  //   ...contractConfig,
  //   functionName: "withdraw",
  //   overrides: {
  //     gasLimit: 500000,
  //   },
  // });

  // useEffect(() => {
  //   console.log("error while previewing Claim: ", error);
  // }, [error]);

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
    userHasPendingDeposit,
    claimData,
    unlockData,
  };
};

export const useVaultState = (epoch: bigint) => {
  const contractConfig = useContractConfig();
  const vaultState: any = useContractRead({
    ...contractConfig as any,
    functionName: "vaultStates",
    args: [epoch],
  });

  return vaultState;
};

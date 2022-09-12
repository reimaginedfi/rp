import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { BigNumber, constants } from "ethers";
import { commify, formatUnits, parseUnits } from "ethers/lib/utils";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useToken,
  useWaitForTransaction,
} from "wagmi";
import { ContractConfig } from "../../contracts";
import { useContractConfig } from "../Vault/ContractContext";
import { noSpecialCharacters } from "../utils/stringsAndNumbers";
import { useEffect } from "react";

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
    watch: true,
  });

  const vaultName = useContractRead({
    ...contractConfig,
    functionName: "name",
  });

  const storedFee = useContractRead({
    ...contractConfig,
    functionName: "storedFee",
    watch: true,
  });

  const maxDeposit = useContractRead({
    ...contractConfig,
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

  const totalDeposited =
    user.data && BigNumber.isBigNumber(user.data.assetsDeposited)
      ? BigNumber.from(user.data.assetsDeposited).toNumber()
      : 0;

  return {
    user,
    sharesValue,
    hasPendingDeposit,
    hasPendingDepositValue:
      hasPendingDeposit.data ||
      (BigNumber.isBigNumber(user.data?.[1]) &&
        BigNumber.from(user.data?.[1]).gt(0)),
    totalDeposited,
  };
};

export const useVaultDeposit = (
  contractConfig: ContractConfig,
  depositAmount: string,
  _for?: string
) => {
  const { assetToken } = useVaultMeta(contractConfig);
  const { address } = useAccount();
  const addRecentTransaction = useAddRecentTransaction();

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

  const isApproved =
    BigNumber.isBigNumber(allowance) &&
    allowance.gte(
      parseUnits(
        noSpecialCharacters(depositAmount),
        assetToken.data?.decimals
      ) ?? "0"
    );

  const {
    data: approveData,
    write: approve,
    isLoading,
    error: approveError,
    status: approveStatus,
  } = useContractWrite({
    addressOrName: assetToken.data?.address ?? "",
    contractInterface: erc20ABI,
    functionName: "approve",
    mode: "recklesslyUnprepared",
    args: [
      contractConfig?.addressOrName,
      parseUnits(noSpecialCharacters(depositAmount), assetToken.data?.decimals),
    ],
    onSuccess(data: any, variables: any, context: any) {
      addRecentTransaction({
        hash: data?.hash,
        description: `Approve REFI Pro to spend ${commify(
          noSpecialCharacters(depositAmount)
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
    mode: "recklesslyUnprepared",
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
    ...contractConfig,
    functionName: "deposit",
    args: [
      parseUnits(noSpecialCharacters(depositAmount), assetToken.data?.decimals),
    ],

    onSuccess(data: any, variables: any, context: any) {
      addRecentTransaction({
        hash: data?.hash,
        description: `Deposit ${commify(
          noSpecialCharacters(depositAmount)
        )} USDC`,
        confirmations: 1,
      });
    },
    mode: "recklesslyUnprepared",
    onSettled(data: any, error: any, variables: any, context: any) {
      console.log({ data });
      console.log({ error });
      console.log({ variables });
      console.log({ context });
    },
    overrides: {
      gasLimit: 1000000,
    },
  });

  console.log(status, error);

  const depositFor = useContractWrite({
    ...contractConfig,
    contractInterface: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_assets",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_for",
            type: "address",
          },
        ],
        name: "deposit",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "deposit",
    args: [
      parseUnits(noSpecialCharacters(depositAmount), assetToken.data?.decimals),
      _for,
    ],
    mode: "recklesslyUnprepared",
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
  contractConfig: ContractConfig,
  unlockAmount: string
) => {
  useEffect(() => {
    console.log("unlockAmount", unlockAmount);
  }, [unlockAmount]);
  const { address } = useAccount();
  const { assetToken } = useVaultMeta(contractConfig);

  const userHasPendingRedeem = useContractRead({
    ...contractConfig,
    functionName: "userHasPendingWithdrawal",
    watch: true,
    args: [address ?? ""],
  });

  const hasPendingWithdrawal = userHasPendingRedeem.data;

  const userHasPendingDeposit = useContractRead({
    ...contractConfig,
    functionName: "userHasPendingDeposit",
    watch: true,
    args: [address ?? ""],
  });

  const { user } = useVaultUser(contractConfig, address ?? "");

  const { config } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "unlock",
    args: [parseUnits(unlockAmount ? unlockAmount : "0", 6)],
  });

  const {
    write: unlockShares,
    isLoading: unlockingShares,
    error: unlockingError,
    isSuccess: unlockingSuccess,
    status: unlockingStatus,
    data: unlockData,
  } = useContractWrite(config);

  const { data: withdrawable, error } = useContractRead({
    ...contractConfig,
    functionName: "getWithdrawalAmount",
    args: [address ?? ""],
  });

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
    ...contractConfig,
    functionName: "withdraw",
    overrides: {
      gasLimit: 500000,
    },
    mode: "recklesslyUnprepared",
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

  useEffect(() => {
    console.log("error while previewing Claim: ", error);
  }, [error]);

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
    userHasPendingRedeem,
    claimData,
    unlockData,
  };
};

export const useVaultState = (epoch = 0) => {
  const contractConfig = useContractConfig();
  const vaultState = useContractRead({
    ...contractConfig,
    functionName: "vaultStates",
    args: [epoch],
  });

  return vaultState;
};

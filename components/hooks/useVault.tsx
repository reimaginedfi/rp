import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { BigNumber, constants } from "ethers";
import { commify, formatUnits, parseUnits } from "ethers/lib/utils";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useToken,
} from "wagmi";
import { ContractConfig } from "../../contracts";
import { useContractConfig } from "../Vault/ContractContext";

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
    mode: "recklesslyUnprepared",
    args: [
      contractConfig?.addressOrName,
      parseUnits(depositAmount, assetToken.data?.decimals),
    ],
    onSuccess(data, variables, context) {
      addRecentTransaction({
        hash: data?.hash,
        description: `Approve REFI Pro to spend ${commify(depositAmount)} USDC`,
        confirmations: 1,
      });
    },
  });

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
    args: [parseUnits(depositAmount, assetToken.data?.decimals)],

    onSuccess(data, variables, context) {
      addRecentTransaction({
        hash: data?.hash,
        description: `Deposit ${commify(depositAmount)} USDC`,
        confirmations: 1,
      });
    },
    mode: "recklesslyUnprepared",
    onSettled(data, error, variables, context) {
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
    args: [parseUnits(depositAmount, assetToken.data?.decimals), _for],
    mode: "recklesslyUnprepared",
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
    depositData,
    depositFor,
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
  const userHasPendingDeposit = useContractRead({
    ...contractConfig,
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
  } = useContractWrite({
    ...contractConfig,
    functionName: "unlock",
    args: [parseUnits(unlockAmount ?? "0", 6)],
    mode: "recklesslyUnprepared",
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
    mode: "recklesslyUnprepared",
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
    userHasPendingDeposit,
    userHasPendingRedeem,
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

import { useContractRead, useToken } from "wagmi";
import { useContractConfig } from "../ContractContext";

export const useVaultAsset = () => {
  const contractConfig = useContractConfig();
  const asset: any = useContractRead({
    ...contractConfig,
    functionName: "asset",
  });
  return asset;
};

export const useVaultAssetToken = () => {
  const asset = useVaultAsset();
  const token = useToken({
    address: asset.data?.toString(),
  });
  return token;
};

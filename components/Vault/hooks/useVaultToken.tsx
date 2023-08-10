import { useToken } from "wagmi";
import { useContractConfig } from "../ContractContext";

export const useVaultToken = () => {
  const contractConfig = useContractConfig();
  const vaultToken = useToken({
    address: contractConfig.address,
  });
  return vaultToken;
};

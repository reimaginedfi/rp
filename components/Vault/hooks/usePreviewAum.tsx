import { BigNumber } from "ethers";
import useSWR from "swr";
import { useVaultMeta } from "../../hooks/useVault";
import { useContractConfig } from "../ContractContext";

export const usePreviewAum = () => {
  const swr = useSWR("/api/aum", async () => {
    const data = await fetch("/api/aum").then((res) => res.json());
    return data;
  });

  return swr;
};

export const useCompleteAum = (_previewAum: any) => {

  const previewAum = JSON.parse(_previewAum);
  const contractConfig = useContractConfig();
  const { aum, epoch, aumCap } = useVaultMeta(contractConfig);
  const previewValue = BigNumber.from(previewAum.data?.total_usdc_value ?? 0);
  const aumValue = BigNumber.from(aum.data ?? 0);

  const rawGains = !aumValue.isZero()
    ? previewValue.sub(aumValue)
    : BigNumber.from(0);

  const isAumLoading = !aum.data || !previewAum.data;

  const factor = aumValue.isZero()
    ? 1
    : previewValue.div(aumValue).toNumber() +
      previewValue.mod(aumValue).toNumber() / aumValue.toNumber();

  return {
    aum,
    epoch,
    aumCap,
    previewAum,
    rawGains,
    factor,
    isAumLoading,
    previewValue,
  };
};

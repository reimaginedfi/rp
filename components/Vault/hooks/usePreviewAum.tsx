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

export const useCompleteAum = () => {
  const contractConfig = useContractConfig();
  const { aum, epoch, aumCap } = useVaultMeta(contractConfig);
  const previewAum = usePreviewAum();

  const rawGains = BigNumber.from(previewAum.data?.total_usdc_value ?? 0).sub(
    BigNumber.from(aum.data ?? 0)
  );
  console.log(
    previewAum.data?.total_usdc_value,
    aum?.data,
    rawGains.toString()
  );
  const percentageGainDivisor = rawGains.div(aum.data ?? 1);
  const percentageGainRemainder =
    rawGains.mod(aum.data ?? 1).toNumber() /
    BigNumber.from(aum.data ?? 1).toNumber();

  const factor = percentageGainDivisor.toNumber() + percentageGainRemainder;

  return {
    aum,
    epoch,
    aumCap,
    previewAum,
    rawGains,
    percentageGainDivisor,
    percentageGainRemainder,
    factor,
    isAumLoading: !aum.data || !previewAum.data,
  };
};

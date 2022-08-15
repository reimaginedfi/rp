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

  const rawGains = aum.data!.toNumber() !== 0 ? BigNumber.from(previewAum.data?.total_usdc_value ?? 0).sub(
    BigNumber.from(aum.data ?? 0)
  ) : BigNumber.from(0);

  console.log(aum.data)
  
  const percentageGainDivisor = rawGains.toNumber() !== 0 ? rawGains.div(aum.data ?? 1) : 0;
  const percentageGainRemainder = rawGains.toNumber() !== 0 ? rawGains.mod(aum.data ?? 1).toNumber() /
    BigNumber.from(aum.data ?? 1).toNumber() : 0;

  const factor = percentageGainDivisor !== 0 ? percentageGainDivisor.toNumber() + percentageGainRemainder : 0;

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

import { BigNumber } from "ethers";
import useSWR from "swr";
import { useVaultMeta } from "../../hooks/useVault";
import { useContractConfig } from "../ContractContext";
import { VaultData } from "../../../pages";
import { useContext } from "react";
// import { truncate } from "../../utils/stringsAndNumbers";
import { formatUnits } from "ethers/lib/utils";

export const usePreviewAum = () => {
  const swr = useSWR("/api/aum", async () => {
    const data = await fetch("/api/aum").then((res) => res.json());
    return data;
  });

  return swr;
};

export const useCompleteAum = () => {
// (_previewAum: any, totalAum: any) => {

const value = useContext(VaultData);

  // const previewAum = JSON.parse(_previewAum);
  const previewAum = value!.totalAum;
  const contractConfig = useContractConfig();
  const { aum, epoch, aumCap } = useVaultMeta(contractConfig);
  // const previewValue = BigNumber.from(previewAum.data?.total_usdc_value ?? 0);
  const previewValue = BigNumber.from(Math.trunc(value!.totalAum) ?? 0);
  const aumValue = BigNumber.from(aum.data ?? 0);

  const rawGains = !aumValue.isZero()
    ? value!.totalAum - +formatUnits(aumValue, 6)
    : BigNumber.from(0);

  // const isAumLoading = !aum.data || !previewAum.data;

  const factor = aumValue.isZero()
    ? 1
    : value!.totalAum / +formatUnits(aumValue, 6) +
      previewValue.mod(aumValue).toNumber() / aumValue.toNumber();

  return {
    aum,
    epoch,
    aumCap,
    previewAum,
    rawGains,
    factor,
    // isAumLoading,
    previewValue,
  };
};

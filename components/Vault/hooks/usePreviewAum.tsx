import useSWR from "swr";
import { useVaultMeta } from "../../hooks/useVault";
import { useContractConfig } from "../ContractContext";
import { VaultData } from "../../../pages";
import { useContext } from "react";
// import { truncate } from "../../utils/stringsAndNumbers";
import { formatUnits } from "viem";

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
  const previewAum = value!.totalAum > value!.totalBalance ? value!.totalAum : value!.totalBalance;
  const contractConfig = useContractConfig();
  const { aum, epoch, aumCap } = useVaultMeta(contractConfig);
  const previewValue = Math.trunc(previewAum) ?? 0;
  const aumValue: bigint = aum.data ?? BigInt(0);

  const rawGains = !(Number(aumValue) === 0)
    ? previewAum - +formatUnits(aumValue, 6)
    : 0;

  // const isAumLoading = !aum.data || !previewAum.data;

  const factor = (Number(aumValue) === 0)
    ? 1
    : previewAum / +formatUnits(aumValue, 6) +
     (previewValue / Number(aumValue)) / Number(aumValue);

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

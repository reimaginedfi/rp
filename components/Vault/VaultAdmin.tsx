import {
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useToken,
} from "wagmi";
import { ContractConfig } from "../../contracts";
import { AsciiNumberInput } from "../AsciiNumberInput";
import { AsciiText, NewLine } from "../AsciiText";
import { useVaultMeta } from "../hooks/useVault";
import { InlineButton } from "../InlineButton";

export const VaultAdmin = ({
  contractConfig,
}: {
  contractConfig: ContractConfig;
}) => {
  // react
  const [externalAUM, setExternalAUM] = useState("0");
  const [newAumCap, setNewAumCap] = useState("0");
  const [onceTrue, setOnce] = useState(true);

  // contract reads
  const { address } = useAccount();
  const { asset, assetToken, aum, epoch, farmer, aumCap, vaultName } =
    useVaultMeta(contractConfig);

  useEffect(() => {
    if (onceTrue) {
      setExternalAUM(formatUnits(aum.data ?? 0, assetToken.data?.decimals));
      setOnce(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aum.data]);

  const delta = useContractRead({
    ...contractConfig,
    functionName: "previewProgress",
    args: [parseUnits(externalAUM, assetToken.data?.decimals)],
    watch: true,
  });

  // // contract writes
  const { isLoading: isStartingVault, write: startVault } = useContractWrite({
    ...contractConfig,
    functionName: "startVault",
    args: [
      parseUnits(externalAUM, assetToken.data?.decimals),
      parseUnits(newAumCap, assetToken.data?.decimals),
    ],
  });
  const { isLoading: isProgressing, write: progressEpoch } = useContractWrite({
    ...contractConfig,
    functionName: "progressEpoch",
    args: [parseUnits(externalAUM, assetToken.data?.decimals)],
  });

  const { isLoading: isChangingAumCap, write: updateAumCap } = useContractWrite(
    {
      ...contractConfig,
      functionName: "updateAumCap",
      args: [parseUnits(newAumCap, assetToken.data?.decimals)],
    }
  );
  const assetBalance = useContractRead({
    addressOrName: asset.data?.toString() ?? "",
    contractInterface: erc20ABI,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });
  return (
    <>
      <NewLine />
      <AsciiText padStart={2} background="yellow">
        // admin functions below
      </AsciiText>
      <NewLine />
      <AsciiText padStart={2} background="yellow">
        // aum management
      </AsciiText>
      <AsciiNumberInput
        label={`external AUM:${"\u00a0".repeat(1)}`}
        onChange={(value) =>
          value ? setExternalAUM(value.replace(/[^0-9\.]/g, "")) : 0
        }
        value={`${externalAUM} ${assetToken.data?.symbol}`}
        precision={1}
        step={1}
        max={+(assetBalance.data?.toString() ?? 0)}
        min={0}
      />

      {BigNumber.from(epoch.data ?? 0).eq(0) && (
        <AsciiNumberInput
          label={`initial AUM cap:${"\u00a0".repeat(1)}`}
          onChange={(value) =>
            value ? setNewAumCap(value.replace(/[^0-9\.]/g, "")) : 0
          }
          value={`${newAumCap} ${assetToken.data?.symbol}`}
          precision={1}
          step={1}
          max={+(assetBalance.data?.toString() ?? 0)}
          min={0}
        />
      )}
      {BigNumber.from(epoch.data ?? 0).eq(0) && (
        <AsciiText onClick={() => startVault()} padStart={2}>
          //{" "}
          <InlineButton color={"blue"}>
            [Start Vault with {externalAUM} {assetToken.data?.symbol} existing]
          </InlineButton>
        </AsciiText>
      )}
      <AsciiText padStart={2} opacity={0.5}>
        // this results in{" "}
        {BigNumber.from((delta.data && delta.data[1]) ?? 0).eq(0)
          ? "no change to the farm."
          : `${
              delta.data && delta.data[0]
                ? "an inflow to farm"
                : "an outflow from farm"
            } of ${formatUnits(
              delta.data && delta.data[1],
              assetToken.data?.decimals ?? 0
            )} ${assetToken.data?.symbol}`}
      </AsciiText>
      {BigNumber.from(epoch.data ?? 0).gt(0) && (
        <AsciiText onClick={() => progressEpoch()} padStart={2}>
          <InlineButton color={"blue"}>
            [End epoch {epoch.data?.toString()} at {externalAUM}{" "}
            {assetToken.data?.symbol}]
          </InlineButton>
        </AsciiText>
      )}

      {BigNumber.from(epoch.data ?? 0).gt(0) && (
        <>
          <NewLine />
          <AsciiText padStart={2} opacity={0.5}>
            // current AUM Cap:{" "}
            {formatUnits(aumCap.data ?? 0, assetToken.data?.decimals)}{" "}
            {assetToken.data?.symbol}
          </AsciiText>
          <AsciiNumberInput
            label={`update AUM cap:${"\u00a0".repeat(1)}`}
            onChange={(value) =>
              value ? setNewAumCap(value.replace(/[^0-9\.]/g, "")) : 0
            }
            value={`${newAumCap} ${assetToken.data?.symbol}`}
            precision={1}
            step={1}
            min={0}
          />

          <AsciiText onClick={() => updateAumCap()} padStart={2}>
            //{" "}
            <InlineButton color={"blue"}>
              [Update AUM Cap to {newAumCap} {assetToken.data?.symbol}]
            </InlineButton>
          </AsciiText>
        </>
      )}
    </>
  );
};

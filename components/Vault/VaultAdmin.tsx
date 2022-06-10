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
import { useContractRead, useContractWrite, useToken } from "wagmi";
import { StableVaultType } from "../../contracts";
import { AsciiText, NewLine } from "../AsciiText";
import { InlineButton } from "../InlineButton";

export const VaultAdmin = ({ vault }: { vault: StableVaultType }) => {
  // react
  const [externalAUM, setExternalAUM] = useState("0");
  const [onceTrue, setOnce] = useState(true);
  // contract reads
  const { data: epoch } = useContractRead(vault, "epoch");
  const { data: assetAddress } = useContractRead(vault, "asset");
  const { data: assetToken } = useToken({
    address: assetAddress?.toString(),
  });
  const { data: aumB } = useContractRead(vault, "aum");
  useEffect(() => {
    if (onceTrue) {
      setExternalAUM(formatUnits(aumB ?? 0));
      setOnce(false);
    }
  }, [aumB]);

  const { data: delta } = useContractRead(vault, "previewProgress", {
    args: [parseUnits(externalAUM)],
    watch: true,
  });
  // contract writes
  const { isLoading: isStartingVault, write: startVault } = useContractWrite(
    vault,
    "startVault",
    { args: [parseUnits(externalAUM)] }
  );
  const { isLoading: isProgressing, write: progressEpoch } = useContractWrite(
    vault,
    "progressEpoch",
    { args: [parseUnits(externalAUM)] }
  );
  return (
    <>
      <NewLine />
      <AsciiText padStart={2} background="yellow">
        // admin functions below
      </AsciiText>
      <NewLine />
      <AsciiText padStart={2} opacity={0.5}>
        // aum management
      </AsciiText>
      <HStack spacing={0} m={0} p={0}>
        <AsciiText padStart={2}>external AUM:{"\u00a0"}</AsciiText>
        <NumberInput
          isDisabled={isStartingVault}
          m={0}
          size={"xs"}
          maxW="sm"
          onChange={(value) =>
            value ? setExternalAUM(value.replace(/[^0-9\.]/g, "")) : 0
          }
          value={`${externalAUM} ${assetToken?.symbol}`}
          precision={1}
          step={1}
          min={0}
          allowMouseWheel
        >
          <NumberInputField
            border={"none"}
            fontSize={"unset"}
            background={"blackAlpha.50"}
            p={0}
            display="inline"
            lineHeight={"unset"}
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      {BigNumber.from(epoch).eq(0) && (
        <AsciiText onClick={() => startVault()} padStart={2}>
          //{" "}
          <InlineButton color={"blue"}>
            [Start Vault with {externalAUM} {assetToken?.symbol} existing]
          </InlineButton>
        </AsciiText>
      )}
      {BigNumber.from(epoch).gt(0) && (
        <AsciiText onClick={() => progressEpoch()} padStart={2}>
          //{" "}
          <InlineButton color={"blue"}>
            [End current epoch at {externalAUM} {assetToken?.symbol}]
          </InlineButton>
        </AsciiText>
      )}
      <AsciiText padStart={2}>
        // this results in{" "}
        {BigNumber.from((delta && delta[1]) ?? 0).eq(0)
          ? "no change to the farm."
          : `${
              delta && delta[0] ? "an inflow to farm" : "an outflow from farm"
            } of ${formatUnits(delta && delta[1])} ${assetToken?.symbol}`}
      </AsciiText>
      {/* <AsciiText padStart={2}>
        // which will start next epoch at {formatUnits()}
      </AsciiText> */}
    </>
  );
};

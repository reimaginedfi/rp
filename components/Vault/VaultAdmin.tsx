import {
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useState } from "react";
import { useContractRead, useContractWrite, useToken } from "wagmi";
import { StableVaultType } from "../../contracts";
import { AsciiText, NewLine } from "../AsciiText";
import { InlineButton } from "../InlineButton";

export const VaultAdmin = ({ vault }: { vault: StableVaultType }) => {
  // react
  const [externalAUM, setExternalAUM] = useState("0");
  // contract reads
  const { data: epoch } = useContractRead(vault, "epoch");
  const { data: assetAddress } = useContractRead(vault, "asset");
  const { data: assetToken } = useToken({
    address: assetAddress?.toString(),
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
        // admin functions (only visible to farmer)
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
            [Progress epoch with {externalAUM} {assetToken?.symbol}]
          </InlineButton>
        </AsciiText>
      )}
      <AsciiText padStart={2} background="yellow">
        // end of admin functions
      </AsciiText>
    </>
  );
};

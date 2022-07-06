import {
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useState } from "react";

import { ContractConfig } from "../../contracts";
import { AsciiText, NewLine } from "../AsciiText";
import { InlineButton } from "../InlineButton";
import { FetchTokenResult } from "@wagmi/core";
import { useVaultDeposit } from "../hooks/useVault";
import { AsciiNumberInput } from "../AsciiNumberInput";

export const VaultDeposit = ({
  contractConfig,
  asset,
}: {
  contractConfig: ContractConfig;
  asset?: FetchTokenResult;
}) => {
  // react
  const [depositAmount, setDepositAmount] = useState("0");

  // wagmi
  const {
    balanceDisplay,
    isAllowed,
    isApproving,
    isApprovingMax,
    approve,
    approveMax,
    isStoring,
    storeAsset,
  } = useVaultDeposit(contractConfig, depositAmount);
  return (
    <>
      <NewLine />
      <AsciiText padStart={2} opacity={0.5}>
        // ░░ deposit ░░░░░░░░░░░░░░░░░░
      </AsciiText>
      <AsciiText
        cursor={"pointer"}
        padStart={2}
        onClick={() => {
          /* remove all except number and point */
          setDepositAmount(balanceDisplay.replace(/[^0-9\.]/g, ""));
        }}
      >
        wallet balance: {balanceDisplay} {asset?.symbol}
      </AsciiText>

      <AsciiNumberInput
        label={`deposit amount:${"\u00a0".repeat(1)}`}
        onChange={(value) =>
          value ? setDepositAmount(value.replace(/[^0-9\.]/g, "")) : 0
        }
        value={`${depositAmount} ${asset?.symbol}`}
        precision={1}
        step={1}
        max={+balanceDisplay}
        min={0}
      />
      {!isAllowed && (
        <AsciiText
          padStart={2}
          textColor={"yellow.900"}
          background={"yellow.200"}
          opacity={0.5}
        >
          // allow contract to use your {asset?.symbol}
        </AsciiText>
      )}
      {!isAllowed && (isApproving || isApprovingMax) && (
        <AsciiText padStart={2}>// approving...</AsciiText>
      )}
      {!isAllowed && !isApproving && !isApprovingMax && (
        <>
          {depositAmount != "0" && (
            <AsciiText onClick={() => approve()} padStart={2}>
              //{" "}
              <InlineButton color={"blue"}>
                [Approve {depositAmount} {asset?.symbol}]
              </InlineButton>
            </AsciiText>
          )}
          <AsciiText onClick={() => approveMax()} padStart={2}>
            // <InlineButton color={"blue"}>[Approve Max]</InlineButton>
          </AsciiText>
        </>
      )}
      {isAllowed && isStoring && (
        <AsciiText padStart={2}>// Depositing...</AsciiText>
      )}
      {isAllowed && !isStoring && (
        <AsciiText onClick={() => storeAsset()} padStart={2}>
          //{" "}
          <InlineButton color={"blue"}>
            [Deposit {depositAmount} {asset?.symbol}]
          </InlineButton>
        </AsciiText>
      )}
    </>
  );
};

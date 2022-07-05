import {
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useState } from "react";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { ContractConfig } from "../../contracts";
import { AsciiText, NewLine } from "../AsciiText";
import { useVaultWithdraw } from "../hooks/useVault";
import { InlineButton } from "../InlineButton";
import { VaultClaim } from "./VaultClaim";

export const VaultUnlock = ({
  contractConfig,
}: {
  contractConfig: ContractConfig;
}) => {
  const [unlockAmount, setUnlockAmount] = useState("0");
  const { hasPendingWithdrawal, user, unlockShares } = useVaultWithdraw(
    contractConfig,
    unlockAmount
  );
  return (
    <>
      <NewLine />
      <AsciiText padStart={2} opacity={0.5}>
        // ## withdrawal
      </AsciiText>
      {hasPendingWithdrawal && (
        <>
          <AsciiText
            padStart={2}
            textColor={"yellow.900"}
            background={"yellow.200"}
            opacity={0.5}
          >
            // you have a pending withdrawal
          </AsciiText>
          <VaultClaim contractConfig={contractConfig} />
        </>
      )}

      {!hasPendingWithdrawal && (
        <>
          <AsciiText padStart={2}>
            your vault tokens: {formatUnits(user.data?.vaultShares ?? 0)} VT
          </AsciiText>
          {BigNumber.from(user.data?.vaultShares ?? 0).gt(0) && (
            <>
              {BigNumber.from(user.data?.sharesToRedeem ?? 0).gt(0) && (
                <AsciiText padStart={2}>
                  unlocking next epoch: {formatUnits(user.data?.sharesToRedeem)}{" "}
                  VT
                </AsciiText>
              )}
              <HStack spacing={0} m={0} p={0}>
                <AsciiText padStart={2}>unlock amount:{"\u00a0"}</AsciiText>
                <NumberInput
                  m={0}
                  size={"xs"}
                  maxW="sm"
                  onChange={(value) =>
                    value ? setUnlockAmount(value.replace(/[^0-9\.]/g, "")) : 0
                  }
                  value={`${unlockAmount} VT`}
                  precision={1}
                  step={1}
                  max={
                    +formatUnits(
                      BigNumber.from(user.data?.vaultShares ?? 0).sub(
                        user.data?.sharesToRedeem ?? 0
                      )
                    )
                  }
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
              {!hasPendingWithdrawal && (
                <AsciiText padStart={2} opacity={0.5}>
                  // VT unlocking is irreversible
                </AsciiText>
              )}
              <AsciiText
                onClick={() => {
                  unlockShares.write();
                }}
                padStart={2}
              >
                //{" "}
                <InlineButton color={"blue"}>
                  [Unlock {unlockAmount} VT]
                </InlineButton>
              </AsciiText>
            </>
          )}
        </>
      )}

      {BigNumber.from(user.data?.vaultShares ?? 0).eq(0) && (
        <AsciiText padStart={2} opacity={0.5}>
          // <InlineButton>[no withdrawable balance]</InlineButton>
        </AsciiText>
      )}

      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </>
  );
};

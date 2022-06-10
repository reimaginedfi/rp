import {
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { StableVaultType } from "../../contracts";
import { AsciiText, NewLine } from "../AsciiText";
import { InlineButton } from "../InlineButton";
import { VaultClaim } from "./VaultClaim";

export const VaultUnlock = ({ vault }: { vault: StableVaultType }) => {
  const { data: account } = useAccount();
  const { data: hasPendingWithdrawal } = useContractRead(
    vault,
    "userHasPendingWithdrawal",
    {
      watch: true,
      args: [account?.address],
    }
  );

  const { data: user } = useContractRead(vault, "vaultUsers", {
    watch: true,
    args: [account?.address],
  });
  const [
    assetsDepositedB,
    epochLastDepositedB,
    vaultSharesB,
    userSharesToRedeemB,
    epochToRedeemB,
  ] = user ?? [0, 0, 0, 0, 0];

  const [unlockAmount, setUnlockAmount] = useState("0");
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
          <VaultClaim vault={vault} />
        </>
      )}

      {!hasPendingWithdrawal && (
        <>
          <AsciiText padStart={2}>
            your vault tokens: {formatUnits(vaultSharesB)} VT
          </AsciiText>
          {BigNumber.from(vaultSharesB).gt(0) && (
            <>
              {BigNumber.from(userSharesToRedeemB).gt(0) && (
                <AsciiText padStart={2}>
                  unlocking next epoch: {formatUnits(userSharesToRedeemB)} VT
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
                      BigNumber.from(vaultSharesB).sub(userSharesToRedeemB)
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
                <AsciiText
                  padStart={2}
                  textColor={"yellow.900"}
                  background={"yellow.200"}
                  opacity={0.5}
                >
                  // VT unlocking is irreversible
                </AsciiText>
              )}
              <AsciiText onClick={() => {}} padStart={2}>
                //{" "}
                <InlineButton color={"blue"}>
                  [Unlock {unlockAmount} VT]
                </InlineButton>
              </AsciiText>
            </>
          )}
        </>
      )}

      {BigNumber.from(vaultSharesB).eq(0) && (
        <AsciiText padStart={2} opacity={0.5}>
          // <InlineButton>[no withdrawable balance]</InlineButton>
        </AsciiText>
      )}

      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </>
  );
};

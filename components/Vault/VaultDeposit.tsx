import {
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { BigNumber, constants } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useState } from "react";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useToken,
} from "wagmi";
import { StableVaultType } from "../../contracts";
import { AsciiText, NewLine } from "../AsciiText";
import { InlineButton } from "../InlineButton";

export const VaultDeposit = ({ vault }: { vault: StableVaultType }) => {
  // react
  const [depositAmount, setDepositAmount] = useState("0");

  // ethers
  const { data: account } = useAccount();
  const { data: assetAddress } = useContractRead(vault, "asset");
  const { data: assetToken } = useToken({
    address: assetAddress?.toString(),
  });
  const asset = {
    addressOrName: assetAddress?.toString()!,
    contractInterface: erc20ABI,
  };
  const { data: balanceB } = useContractRead(asset, "balanceOf", {
    args: [account?.address],
    watch: true,
  });
  // balance 50 DAI == 50_000_000_000_000_000_000
  const balanceDisplay = BigNumber.isBigNumber(balanceB)
    ? formatUnits(balanceB)
    : "0";

  const { data: allowanceB } = useContractRead(asset, "allowance", {
    args: [account?.address, vault.addressOrName],
    watch: true,
  });
  const isAllowed =
    BigNumber.isBigNumber(allowanceB) &&
    allowanceB.gte(parseUnits(depositAmount) ?? "0");

  const { write: approve, isLoading: isApproving } = useContractWrite(
    asset,
    "approve",
    {
      args: [vault.addressOrName, parseUnits(depositAmount)],
    }
  );
  const { write: approveMax, isLoading: isApprovingMax } = useContractWrite(
    asset,
    "approve",
    {
      args: [vault.addressOrName, constants.MaxUint256],
    }
  );
  const { write: storeAsset, isLoading: isStoring } = useContractWrite(
    vault,
    "storeAssetForDeposit",
    {
      args: [parseUnits(depositAmount)],
    }
  );
  return (
    <>
      <NewLine />
      <AsciiText padStart={2} opacity={0.5}>
        // ## deposit
      </AsciiText>
      <AsciiText
        cursor={"pointer"}
        padStart={2}
        onClick={() => {
          setDepositAmount(balanceDisplay.replace(/[^0-9\.]/g, ""));
        }}
      >
        wallet balance: {balanceDisplay} {assetToken?.symbol}
      </AsciiText>
      <HStack spacing={0} m={0} p={0}>
        <AsciiText padStart={2}>deposit amount:{"\u00a0"}</AsciiText>
        <NumberInput
          isDisabled={isApproving || isApprovingMax}
          m={0}
          size={"xs"}
          maxW="sm"
          onChange={(value) =>
            value ? setDepositAmount(value.replace(/[^0-9\.]/g, "")) : 0
          }
          value={`${depositAmount} ${assetToken?.symbol}`}
          precision={1}
          step={1}
          max={+balanceDisplay}
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
      {!isAllowed && (
        <AsciiText
          padStart={2}
          textColor={"yellow.900"}
          background={"yellow.200"}
          opacity={0.5}
        >
          // allow contract to use your {assetToken?.symbol}
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
                [Approve {depositAmount} {assetToken?.symbol}]
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
            [Deposit {depositAmount} {assetToken?.symbol}]
          </InlineButton>
        </AsciiText>
      )}
    </>
  );
};

import { formatUnits } from "ethers/lib/utils";
import { useAccount, useContractRead, useToken } from "wagmi";
import { StableVaultType } from "../../contracts";
import { AsciiText, NewLine } from "../AsciiText";

export const VaultUserState = ({ vault }: { vault: StableVaultType }) => {
  // data
  const { data: account } = useAccount();
  const { data: assetAddress } = useContractRead(vault, "asset");
  const { data: assetToken } = useToken({
    address: assetAddress?.toString(),
  });
  const { data: hasPendingDeposit } = useContractRead(
    vault,
    "userHasPendingUpdate",
    {
      args: [account?.address],
      watch: true,
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
  const { data: previewResult } = useContractRead(vault, "previewRedeem", {
    args: [vaultSharesB],
  });
  return (
    <>
      <AsciiText padStart={1} />
      <AsciiText padStart={2} opacity={0.5}>
        // ## your stats
      </AsciiText>
      <AsciiText padStart={2}>
        stored value: {formatUnits(previewResult ?? 0)} {assetToken?.symbol}
      </AsciiText>
      <AsciiText padStart={2}>
        has pending deposit: {hasPendingDeposit ? "true" : "false"}
      </AsciiText>
      {/* <AsciiText padStart={2}>
        has pending deposit: {hasPendingDeposit ? "true" : "false"}
      </AsciiText>
      <AsciiText padStart={2}>pending deposit: 0 {symbol}</AsciiText>

      <AsciiText padStart={2} opacity={0.5}>
        // total deposited: 0 {symbol}
      </AsciiText>
      <AsciiText padStart={2} opacity={0.5}>
        // total withdrawn: 0 {symbol}
      </AsciiText> */}
    </>
  );
};

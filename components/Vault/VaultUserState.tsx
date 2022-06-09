import { useAccount, useContractRead, useToken } from "wagmi";
import { StableVaultType } from "../../contracts";
import { AsciiText } from "../AsciiText";

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
  return (
    <>
      <AsciiText padStart={1} />
      <AsciiText padStart={2} opacity={0.5}>
        // your stats
      </AsciiText>
      <AsciiText padStart={2}>stored value: 0 {assetToken?.symbol}</AsciiText>
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

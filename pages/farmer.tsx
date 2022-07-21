// export default function () => {
//   return <h1>farmer</h1>
// }

import { Button, Code, Heading, Stack } from "@chakra-ui/react";
import { BigNumber, constants } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import {
  chainId,
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { useVaultMeta } from "../components/hooks/useVault";
import { vaults } from "../contracts";

const FarmerPage = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const contractConfig = vaults[chain?.id ?? 1][0];
  const meta = useVaultMeta(contractConfig);
  const { isLoading: isStartingVault, write: startVault } = useContractWrite({
    ...contractConfig,
    functionName: "startVault",
    args: [
      parseUnits("0", meta.assetToken.data?.decimals),
      parseUnits("10000", meta.assetToken.data?.decimals),
    ],
  });
  const { isLoading: isDepositing, write: deposit } = useContractWrite({
    ...contractConfig,
    functionName: "deposit",
    args: [parseUnits("10", meta.assetToken.data?.decimals)],
  });

  const { isLoading, write } = useContractWrite({
    addressOrName: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    contractInterface: erc20ABI,
    functionName: "approve",
    args: ["0x00000008786611c72A00909bD8d398b1bE195Be3", parseUnits("2000", 6)],
  });

  const { isLoading: enablingFees, write: enableFees } = useContractWrite({
    ...contractConfig,
    functionName: "setIsFeeEnabled",
    args: [true],
  });

  const { data } = useContractRead({
    addressOrName: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    contractInterface: erc20ABI,
    functionName: "allowance",
    args: [address, "0x00000008786611c72A00909bD8d398b1bE195Be3"],
    watch: true,
  });
  return (
    <Stack>
      <Heading>Farmer Page</Heading>
      <Code as="pre">{JSON.stringify(meta, null, 2)}</Code>
      <Button onClick={() => startVault()} isLoading={isStartingVault}>
        Start
      </Button>
      <Button onClick={() => deposit()} isLoading={isDepositing}>
        Deposit
      </Button>

      <Button onClick={() => write()} isLoading={isLoading}>
        Approve Max
      </Button>

      <Button onClick={() => enableFees()} isLoading={enablingFees}>
        Enable Fees
      </Button>
      <Heading>
        Allowance:{" "}
        {BigNumber.isBigNumber(data)
          ? BigNumber.from(data).toString()
          : "loading"}
      </Heading>
    </Stack>
  );
};

export default FarmerPage;

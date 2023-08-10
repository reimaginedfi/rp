import {
  Button,
  Flex,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { commify } from "ethers/lib/utils";
import { useToken } from "wagmi";
import ProgressBar from "./ui/ProgressBar";
import { truncate } from "./utils/stringsAndNumbers";

export interface TokenInputProps {
  amount: string;
  setAmount: (amount: string) => void;
  balanceDisplay: string;
  errorMessage?: string;
  tokenAddress: string;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  amount,
  setAmount,
  balanceDisplay,
  errorMessage = "",
  tokenAddress,
}) => {
  const { colorMode } = useColorMode();

  const { data } = useToken({ address: tokenAddress as `0x${string}` });
  const images: Record<string, string> = {
    USDC: "/icons/usdc.svg",
  };
  return (
    <Stack
      w={"full"}
      alignItems="stretch"
      p={2}
      border={+amount > +balanceDisplay ? "solid 1px red" : (null as any)}
      borderRadius="8px"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        borderRadius="md"
        my={1}
      >
        <Flex alignItems={"center"} py={1} px={2} mr={2} alignSelf="stretch">
          {data?.symbol && images[data?.symbol] && (
            <Image
              mr="0.25rem"
              w="1.5rem"
              h="1.5rem"
              src={images[data?.symbol]}
            />
          )}
          <Text fontSize="1.5rem">{data?.symbol}</Text>
        </Flex>
        <NumberInput
          placeholder={"0.0"}
          min={0}
          step={1000}
          flex={1}
          value={truncate(amount, 2)}
          onChange={setAmount}
          allowMouseWheel
          bg={colorMode === "dark" ? "#373737" : "#F3F3F3"}
          borderRadius="1rem"
          inputMode="numeric"
        >
          <NumberInputField
            onChange={(e) => setAmount(e.target.value.toString())}
            textAlign="right"
            border="none"
            fontSize="1.5rem"
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
      <Flex justifyContent={"space-between"} alignContent="center">
        <Text variant="extralarge" fontSize="sm" mr={2} alignSelf="center">
          Balance: {commify(truncate(balanceDisplay, 2))} {data?.symbol}
        </Text>
        <Button
          onClick={() => setAmount(balanceDisplay)}
          variant={"tertiary"}
          p={4}
          fontSize="1rem"
        >
          Max
        </Button>
      </Flex>
      <ProgressBar total={+balanceDisplay} partial={+amount} size="0.5rem" />
      {errorMessage && errorMessage !== "" && (
        <Text fontSize="xs" color={"red"}>
          {errorMessage}
        </Text>
      )}
      {/* {+amount > +balanceDisplay && (
        <Text fontSize="xs" color={"red"}>
          Exceeds wallet balance
        </Text>
      )}

      {(!meetsMinimum || (!depositAllowed && amount !== "")) && (
        <Text fontSize="xs" color={"red"}>
          Minimum deposit is{" "}
          {minimumDeposit.data
            ? commify(
                ~~formatUnits(
                  BigNumber.from(minimumDeposit!.data!._hex!).toNumber(),
                  6
                )
              )
            : "25,000"}{" "}
          USDC
        </Text>
      )} */}
    </Stack>
  );
};

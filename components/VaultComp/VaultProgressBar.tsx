import { useState, useEffect } from "react";

import { Box, Text, HStack, Skeleton, useColorMode } from "@chakra-ui/react";

type ProgressBarProps = {
  currentAum: number;
  aumCap: number;
  remainingDeposits: string | undefined;
  color?: string;
};

export default function VaultProgressBar({
  currentAum,
  aumCap,
  remainingDeposits,
  color = "#C51E25",
}: ProgressBarProps) {
  const { colorMode } = useColorMode();

  const [aumPercentage, setAumPercentage] = useState<number>();
  const [depositPercentage, setDepositPercentage] = useState<number>();

  useEffect(() => {
    setAumPercentage((100 * currentAum) / aumCap);
    setDepositPercentage((100 * parseInt(remainingDeposits!)) / aumCap);
  }, [aumCap]);

  const progressValues = [
    {
      name: "AUM",
      value: aumPercentage!,
      color,
      radius: "1rem",
    },
    {
      name: "PENDING",
      value: depositPercentage!,
      color: "#E9A9AB",
      radius: "1rem",
    },
  ];

  const bars = progressValues.map(function (item, i) {
    if (item.value > 0) {
      return (
        <Box
          height="0.25rem"
          bgColor={item.color}
          width={item.value + "%"}
          borderRightRadius={
            item.name === "AUM" && !depositPercentage
              ? item.radius
              : depositPercentage && item.name === "PENDING"
              ? item.radius
              : (null as any)
          }
          borderLeftRadius={
            item.name === "AUM"
              ? item.radius
              : item.name === "PENDING" && !aumPercentage
              ? item.radius
              : (null as any)
          }
          key={i}
        ></Box>
      );
    }
  });

  return (
    <Box
      display="inline-block"
      w="100%"
      height="0.25rem"
      bgColor={colorMode === "dark" ? "#373434" : "#E8E8E8"}
      borderRadius="1rem"
      mb="0"
      pb="0"
    >
      {bars != null ? bars : <Skeleton h="0.25rem" />}
    </Box>
  );
}

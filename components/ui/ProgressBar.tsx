import { useEffect, useState } from "react";

import { Box, Skeleton, useColorMode } from "@chakra-ui/react";

type ProgressBarProps = {
    total: number;
    totalColor?: string;
    partial: number;
    partialColor?: string;
    remaining?: string | undefined;
    size?: string;
};

export default function ProgressBar({
  total,
  totalColor,
  partial,
  partialColor,
  remaining,
  size
}: ProgressBarProps) {
  const { colorMode } = useColorMode();

  const [totalPercentage, setTotalPercentage] = useState<number>();
  const [remainingPercentage, setRemainingPercentage] = useState<number>();

  // useEffect(() => {
  //   setTotalPercentage((100 * partial) / total);
  //   if (remaining) setRemainingPercentage(();
  // }, [total, partial]);

  const progressValues = [
    {
      name: "TOTAL",
      value: total && partial && ((100 * partial) / total),
      color: totalColor ?? "#C51E25",
      radius: "1rem",
    },
    {
      name: "REMAINING",
      value: remaining && ((100 * parseFloat(remaining)) / total),
      color: partialColor ?? "#E9A9AB",
      radius: "1rem",
    },
  ];

  const bars = progressValues.map(function (item, i) {
    if (item.value! > 0) {
      return (
        <Box
          display={"inline-block"}
          height={size ?? "0.25rem"}
          bgColor={item.color}
          width={item.value + "%"}
          borderRightRadius={
            item.name === "TOTAL" && !remaining
              ? item.radius
              : remainingPercentage && item.name === "REMAINING"
              ? item.radius
              : (null as any)
          }
          borderLeftRadius={
            item.name === "TOTAL"
              ? item.radius
              : item.name === "REMAINING" && !total
              ? item.radius
              : (null as any)
          }
          key={i}
        />
      );
    }
  });

  return (
    <Box
      display="flex"
      w="100%"
      h={size ?? "0.25rem"}
      bgColor={colorMode === "dark" ? "#373434" : "#E8E8E8"}
      borderRadius="1rem"
    >
      {bars != null ? bars : <Skeleton h="0.25rem" />}
    </Box>
  );
}

import { Box, Text, chakra } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import supabaseClient from "../../utils/supabaseClient";

export const Charts = ({data, forHero = false, epoch = 0}: {data: any, forHero?: boolean, epoch?: number}) => {

  const CustomToolTip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          boxShadow="dark-lg"
          p={forHero ? 1 : 3}
          rounded="md"
          bg="#FFE5E5"
          color="black"
          className="custom-tooltip"
        >
          <Text fontSize={forHero ? "0.75rem" : "0.85rem"}>
            <chakra.span fontWeight="semibold" color="red">
              Date:
            </chakra.span>{" "}
            {moment(
              new Date(data[label].Date).toISOString().substring(0, 10)
            ).format("ll")}
          </Text>
          <Text fontSize={forHero ? "0.75rem" : "0.85rem"}>
            <chakra.span fontWeight="semibold" color="red">
              Change:
            </chakra.span>{" "}

            {data[label].Change} %
          </Text>
          <Text fontSize={forHero ? "0.75rem" : "0.85rem"}>
            <chakra.span fontWeight="semibold" color="red">
              Gain:
            </chakra.span>{" "}
            {data[label].amount_change} USDC
          </Text>
          <Text fontSize={forHero ? "0.75rem" : "0.85rem"}>
            <chakra.span fontWeight="semibold" color="red">
              AUM:
            </chakra.span>{" "}
            {data[label].Amount}
          </Text>
        </Box>
      );
    }
    return null;
  };

  return (
      <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: epoch === 3 ? 130 : (epoch === 0 && !forHero) ? 125 : forHero || epoch === 2 ? 75 : 35,
        }}
      >
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={<CustomToolTip />} />
        <Area
          dataKey="Change"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPrice)"
        />
        {/* <Tooltip /> */}
      </AreaChart>
    </ResponsiveContainer>
 );
};
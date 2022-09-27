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

export const Charts = ({data, wholeData = false, forHero = false, epoch3 = false}: {data: any, wholeData?: boolean, forHero?: boolean, epoch3?: boolean}) => {

  const CustomToolTip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          boxShadow="dark-lg"
          p={3}
          rounded="md"
          bg="#FFE5E5"
          color="black"
          className="custom-tooltip"
        >
          <Text>
            <chakra.span fontWeight="semibold" color="red">
              Date:
            </chakra.span>{" "}
            {moment(
              new Date(data[label].Date).toISOString().substring(0, 10)
            ).format("ll")}
          </Text>
          <Text>
            <chakra.span fontWeight="semibold" color="red">
              Change:
            </chakra.span>{" "}

            {data[label].Change} %
          </Text>
          <Text>
            <chakra.span fontWeight="semibold" color="red">
              Gain:
            </chakra.span>{" "}
            {data[label].amount_change} USDC
          </Text>
          <Text>
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
          bottom: epoch3 ? 75 : wholeData ? 50 : 25,
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
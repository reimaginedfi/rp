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

const Charts = ({data, wholeData = false}: {data: any, wholeData?: boolean}) => {

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
            {new Date(data[label].Date).toISOString().split("T")[0]}
          </Text>
          <Text>
            <chakra.span fontWeight="semibold" color="red">
              Change:
            </chakra.span>{" "}
            {data[label].Change} %
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
          right: wholeData ? 170: 10,
          left: 0,
          bottom: 25,
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
          type="monotone"
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

export default Charts;

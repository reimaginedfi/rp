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

const Charts = () => {
  const [pastEpochData, setPastEpochData] = useState<any[]>([]);

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
            {new Date(pastEpochData[label].Date).toISOString().split("T")[0]}
          </Text>
          <Text>
            <chakra.span fontWeight="semibold" color="red">
              Change:
            </chakra.span>{" "}
            {pastEpochData[label].Change} %
          </Text>
        </Box>
      );
    }
    return null;
  };

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabaseClient
        .from("rp_data")
        .select("*")
        .order("created_at", { ascending: true });
      if (!data && error) {
        console.log("Error while fetching epoch data", error);
        alert("Error while fetching epoch data");
        return;
      }
      setPastEpochData(
        data
          .sort((a, b) =>
            moment(b.created_at, "DD-MM-YYYY").diff(
              moment(a.created_at, "DD-MM-YYYY")
            )
          )
          .map(({ percentage_change, created_at, ...rest }) => ({
            ...rest,
            Change: percentage_change,
            Date: created_at,
          }))
      );
    };
    getData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={pastEpochData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
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
        {/* <XAxis dataKey="created_at" /> */}
        {/* <YAxis /> */}
        <Tooltip />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Charts;

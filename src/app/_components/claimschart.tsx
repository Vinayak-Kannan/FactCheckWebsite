"use client";
import React, { useEffect, useState } from "react";
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { api } from "~/trpc/react";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

// scatter plot configurations
const options: ChartOptions<"scatter"> = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: "X coordinate of a embedded claim",
      },
    },
    y: {
      title: {
        display: true,
        text: "Y coordinate of a embedded claim",
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const dataset = context.dataset;
          const index = context.dataIndex;
          const point = dataset.data[index] as {
            x: number;
            y: number;
            text: string;
            cleaned_veracity: string;
            cleaned_predict_veracity: string;
          };
          const clusterName = dataset.label; // Cluster name

          return [
            `Cluster: ${clusterName}`,
            `Claim: ${point.text}`,
            `Predicted Veracity: ${point.cleaned_predict_veracity}`,
            `Veracity: ${point.cleaned_veracity}`,
          ];
        },
      },
    },
  },
};

export function ClaimsChart() {
  const allClaimsFromQuery = api.post.listClaims.useQuery(undefined, {
    enabled: true,
  });

  interface ScatterDataPoint {
    x: number;
    y: number;
    text: string;
    cleaned_veracity: string;
    cleaned_predict_veracity: string;
  }

  const [chartData, setChartData] = useState<
    ChartData<"scatter", ScatterDataPoint[], string>
  >({
    datasets: [],
  });

  const [selectedCluster, setSelectedCluster] = useState<string>("all");
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<string>("all");

  useEffect(() => {
    if (allClaimsFromQuery.data) {
      const claims = allClaimsFromQuery.data;
      // const clusterColors = new Map<number, string>();
      const trueFalseColors = new Map<string, string>([
        ["True", "green"],
        ["False", "red"],
      ]);
      // const generateColor = () => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;

      const filteredClaims = claims.filter(
        (claim) =>
          (selectedCluster === "all" ||
            claim.cluster_name === selectedCluster) &&
          (selectedTrueFalse === "all" ||
            String(claim.cleaned_veracity).toLowerCase() === selectedTrueFalse),
      );

      const datasets = Object.entries(
        filteredClaims.reduce(
          (
            acc: Record<
              number,
              {
                label: string;
                data: ScatterDataPoint[];
                backgroundColor: string[];
              }
            >,
            claim,
          ) => {
            const cluster: number = claim.cluster;
            if (!acc[cluster]) {
              acc[cluster] = {
                label: claim.cluster_name,
                data: [],
                backgroundColor: [],
              };
            }
            acc[cluster].data.push({
              x: claim.x,
              y: claim.y,
              text: claim.text,
              cleaned_veracity: claim.cleaned_veracity,
              cleaned_predict_veracity: claim.cleaned_predict_veracity,
            });
            acc[cluster].backgroundColor.push(
              trueFalseColors.get(claim.cleaned_veracity) ?? "gray",
            );
            return acc;
          },
          {},
        ),
      ).map(([_, dataset]) => dataset);

      setChartData({ datasets });
    }
  }, [allClaimsFromQuery.data, selectedCluster, selectedTrueFalse]);

  if (allClaimsFromQuery.isLoading || !chartData || !options) {
    return <div>Loading...</div>;
  }

  const clusterOptions = Array.from(
    new Set(allClaimsFromQuery.data?.map((claim) => claim.cluster_name) ?? []),
  );

  return (
    <Box className="flex min-h-screen w-full flex-col items-center">
      <Box className="mb-4 flex gap-4">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="cluster-label">Cluster</InputLabel>
          <Select
            labelId="cluster-label"
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            fullWidth
          >
            <MenuItem value="all">All</MenuItem>
            {clusterOptions.map((cluster) => (
              <MenuItem key={cluster} value={cluster}>
                {cluster}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="veracity-label">Veracity</InputLabel>
          <Select
            labelId="veracity-label"
            value={selectedTrueFalse}
            onChange={(e) => setSelectedTrueFalse(e.target.value)}
            fullWidth
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box className="flex w-full max-w-4xl flex-col gap-8 p-8">
        <Scatter options={options} data={chartData} />
      </Box>
    </Box>
  );
}

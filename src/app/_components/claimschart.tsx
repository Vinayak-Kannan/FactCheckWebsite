"use client";
import React, {useEffect, useState } from 'react';
import {Box} from "@mui/material";
import { Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';
import type { ChartData, ChartOptions} from 'chart.js';
import {api} from "~/trpc/react";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);


// scatter plot configurations
const options: ChartOptions<"scatter"> = {
    responsive: true,
    scales: {
        x: {
            title: {
                display: true,
                text: "X-Axis",
            },
        },
        y: {
            title: {
                display: true,
                text: "Y-Axis",
            },
        },
    },
    plugins: {
        tooltip: {
            callbacks: {
                // customize Tooltip contents
                label: (context) => {
                    const dataset = context.dataset; // Get the current point's data
                    const index = context.dataIndex; // current point index
                    const point = dataset.data[index] as { x: number; y: number; text: string };
                    const clusterName = dataset.label; // current point cluster name
                    return `Text: ${point.text}, Cluster: ${clusterName}`;
                },
            },
        },
    },
};


export function ClaimsChart(){

    const allClaimsFromQuery = api.post.listClaims.useQuery(undefined, {
        enabled: true,
    });
    interface ScatterDataPoint {
        x: number;
        y: number;
    }
    const [chartData, setChartData] = useState<ChartData<"scatter", ScatterDataPoint[], string>>({
        datasets: [],
    });

    useEffect(() => {
        if (allClaimsFromQuery.data) {
            const claims = allClaimsFromQuery.data;
            const clusterColors = new Map<number, string>();
            const generateColor = () => {
                // randomly generating RGB
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 1)`;
            };

            // map claims -> scatterplot
            const datasets = Object.entries(
                claims.reduce((acc: Record<number, { label: string; data: { x: number; y: number; text: string }[]; backgroundColor: string }>, claim) => {
                    const cluster: number = claim.cluster;

                    if (!clusterColors.has(cluster)) {
                        clusterColors.set(cluster, generateColor());
                    }


                    if (!acc[cluster]) {
                        acc[cluster] = {
                            label: claim.cluster_name,
                            data: [],
                            backgroundColor: clusterColors.get(cluster)!,

                        };
                    }
                    acc[cluster].data.push({ x: claim.x, y: claim.y, text: claim.text });
                    return acc;
                }, {})
            ).map(([_, dataset]) => dataset);
            setChartData({ datasets }); // update
        }

    }, [allClaimsFromQuery.data]);

    if (allClaimsFromQuery.isLoading || !chartData || !options) {
        return <div>Loading...</div>;
    }

    return (
        <Box className="flex min-h-screen w-full">
            <Box className="flex w-full max-w-4xl flex-col gap-8 p-8">
                <Scatter options={options} data={chartData} />
            </Box>

        </Box>
    );
}
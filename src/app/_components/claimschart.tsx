"use client";
import React, {useEffect, useState } from 'react';
import {Box, Typography} from "@mui/material";
import { Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from 'chart.js';
import {api} from "~/trpc/react";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);



// scatterplot configurations
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
                    // 获取当前点的数据
                    const dataset = context.dataset; // Get the current point's data
                    const index = context.dataIndex; // 当前点索引
                    const point = dataset.data[index] as { x: number; y: number; text: string }; // 强制类型定义
                    const clusterName = dataset.label; // 当前点所在的 cluster 名称
                    return `Text: ${point.text}, Cluster: ${clusterName}`;
                },
            },
        },
    },
};

// const data = {
//     datasets: [
//         {
//             label: 'A dataset',
//             data: [
//             ],
//             backgroundColor: 'rgba(255, 99, 132, 1)',
//         },
//     ],
// };


export function ClaimsChart(){

    const allClaimsFromQuery = api.post.listClaims.useQuery(undefined, {
        enabled: true,
    });
    interface ScatterDataPoint {
        x: number;
        y: number;
    }

    interface ScatterDataset {
        label: string;
        data: ScatterDataPoint[];
        backgroundColor: string;
    }

    const [chartData, setChartData] = useState<ChartData<"scatter", ScatterDataPoint[], string>>({
        datasets: [], // 初始值设置为空数组，匹配 Scatter 的要求
    });


    useEffect(() => {
        console.log(allClaimsFromQuery)
        console.log(allClaimsFromQuery.data)
        if (allClaimsFromQuery.data) {
            const claims = allClaimsFromQuery.data;

            // // 设置颜色数组，每个 cluster 一个颜色
            // const clusterColors: Record<number, string> = {
            //     1: "rgba(255, 99, 132, 1)",  // 红色
            //     2: "rgba(54, 162, 235, 1)",  // 蓝色
            //     3: "rgba(75, 192, 192, 1)",  // 绿色
            //     4: "rgba(255, 206, 86, 1)",  // 黄色
            //     5: "rgba(153, 102, 255, 1)", // 紫色
            //     6: "rgba(255, 159, 64, 1)",  // 橙色
            //     7: "rgba(201, 203, 207, 1)", // 灰色
            //     8: "rgba(140, 177, 240, 1)", // 浅蓝
            //     9: "rgba(220, 120, 220, 1)", // 浅紫
            //     10: "rgba(100, 200, 100, 1)", // 明绿
            //     11: "rgba(240, 128, 128, 1)", // 珊瑚红
            //     12: "rgba(184, 134, 11, 1)",  // 金色
            // };

            const clusterColors = new Map<number, string>();
            // 动态颜色生成器函数
            const generateColor = () => {
                // 随机生成 RGB 颜色
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 1)`; // 颜色不透明
            };





            // 将 claims 数据映射成 scatterplot 数据
            const datasets = Object.entries(
                claims.reduce((acc: Record<number, { label: string; data: { x: number; y: number; text: string }[]; backgroundColor: string }>, claim) => {
                    // 按 cluster 分组
                    const cluster: number = claim.cluster;

                    // 如果该 cluster 不存在已定义的颜色，为其生成新颜色
                    if (!clusterColors.has(cluster)) {
                        clusterColors.set(cluster, generateColor());
                    }


                    if (!acc[cluster]) {
                        acc[cluster] = {
                            label: claim.cluster_name, // 设置数据组标签为 cluster_name
                            data: [],
                            // backgroundColor: clusterColors[cluster] ?? "rgba(0, 0, 0, 1)", // 默认黑色
                            backgroundColor: clusterColors.get(cluster)!, // 从 Map 中提取颜色

                        };
                    }
                    acc[cluster].data.push({ x: claim.x, y: claim.y, text: claim.text }); // 点的数据
                    return acc;
                }, {})
            ).map(([_, dataset]) => dataset); // 转换为数组
            setChartData({ datasets }); // 更新状态
            console.log(chartData)
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
};
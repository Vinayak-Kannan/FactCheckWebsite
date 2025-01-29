"use client";
import React, {useEffect, useState } from 'react';
import {Box, Typography} from "@mui/material";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';
import {ClaimsChart} from "~/app/_components/claimschart";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);


const ChartPage = () => {


    return (
        <Box className="flex min-h-screen w-full">
            <Box className="flex w-full max-w-4xl flex-col gap-8 p-8">
                <Box className="flex flex-col gap-4">
                    <Typography variant="h4" className="font-bold">
                        Chart for Claims
                    </Typography>



                </Box>

                {/* Scatter Plot 图表 */}
                <Box className="flex justify-center items-center w-full">
                    <ClaimsChart />
                </Box>

            </Box>

        </Box>
    );
};

export default ChartPage;

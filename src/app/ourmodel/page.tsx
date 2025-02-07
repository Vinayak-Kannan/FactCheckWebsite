"use client";

import { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import Grid2 from '@mui/material/Grid2'
import React from "react";
import { ClaimsChart } from "../_components/claimschart"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';


export default function OurModel() {
    const [expanded1, setExpanded1] = useState(false);
    const [expanded2, setExpanded2] = useState(false);
    const [expanded3, setExpanded3] = useState(false);
    const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

    function handleStepClick(stepId: string | null) {
        if (selectedStepId === stepId) {
            setSelectedStepId(null);

            setExpanded1(false);
            setExpanded2(false);
            setExpanded3(false);
        } else {

            setSelectedStepId(stepId);

            setExpanded1(false);
            setExpanded2(false);
            setExpanded3(false);

            if (stepId === "A.1") {
                setExpanded1(true);
            } else if (stepId === "A.2") {
                setExpanded2(true);
            } else if (stepId === "A.3") {
                setExpanded3(true);
            }
        }
    }

    const modelSteps = [
        {
            id: "A.1",
            title: "Collect Expert-Checks",
            subtitle: "(Google FC Explorer)",
            tooltip: "TK.",
            onClick: () => handleStepClick("A.1"), // 点击 A.1 后展开 B-G
        },
        {
            id: "A.2",
            title: "Claims-To-Checks",
            subtitle: "(Reddit)",
            tooltip: "TK.",
            onClick: () => handleStepClick("A.2"),
        },
        {
            id: "A.3",
            title: "User-Checks",
            subtitle: "(Similarity Ratings)",
            tooltip: "TK.",
            onClick: () => handleStepClick("A.3"),
        },
    ];

    // Content after A.1 is clicked
    const expandedModelSteps = expanded1 ? [
        {
            id: "B",
            title: "Pre-Processing",
            subtitle: "(Knowledge Base, Model Boundary)",
            tooltip: "TK.",
        },
        {
            id: "C",
            title: "Check Worthiness",
            subtitle: "(ClaimBuster)",
            tooltip: "TK.",
        },
        {
            id: "D",
            title: "LLM Embedding",
            subtitle: "(OpenAI)",
            tooltip: "TK.",
        },
        {
            id: "E",
            title: "Supervised Dimensionality Reduction",
            subtitle: "(UMAP)",
            tooltip: "TK.",
        },
        {
            id: "F",
            title: "Clustering",
            subtitle: "(HDBScan)",
            tooltip: "TK.",
        },
        {
            id: "G",
            title: "Prediction",
            subtitle: "(RAG)",
            tooltip: "TK.",
        },
    ] : [];

    // Content after A.2 is clicked
    const expandedModelSteps2 = expanded2 ? [
        {
            id: "A.2",
            title: "Collect Claims-To-Checks",
            subtitle: "(Reddit)",
            tooltip: "TK.",
        },
        {
            id: "C",
            title: "Check Worthiness",
            subtitle: "(ClaimBuster)",
            tooltip: "TK.",
        },
        {
            id: "B",
            title: "Pre-Processing",
            subtitle: "(Knowledge Base, Model Boundary)",
            tooltip: "TK.",
        },
        {
            id: "D",
            title: "LLM Embedding",
            subtitle: "(OpenAI)",
            tooltip: "TK.",
        },
        {
            id: "E",
            title: "Supervised Dimensionality Reduction",
            subtitle: "(UMAP)",
            tooltip: "TK.",
        },
        {
            id: "F",
            title: "Clustering",
            subtitle: "(HDBScan)",
            tooltip: "TK.",
        },
        {
            id: "G",
            title: "Prediction",
            subtitle: "(RAG)",
            tooltip: "TK.",
        },
    ] : [];

    // Content after A.3 is clicked
    const expandedModelSteps3 = expanded3 ? [
        {
            id: "A.3",
            title: "Collect User-Checks",
            subtitle: "(Similarity Ratings)",
            tooltip: "TK.",
        },
        {
            id: "E",
            title: "Supervised Dimensionality Reduction",
            subtitle: "(UMAP)",
            tooltip: "TK.",
        },
        {
            id: "F",
            title: "Clustering",
            subtitle: "(HDBScan)",
            tooltip: "TK.",
        },
        {
            id: "G",
            title: "Prediction",
            subtitle: "(RAG)",
            tooltip: "TK.",
        },
    ] : [];

    const researchPapers = [
        { title: "Title", authors: "lorem ipsum", date: "August 2024", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittitis eros. Quisque quis euismod lorem.", link: "https://example.com" },
        { title: "Title", authors: "lorem ipsum", date: "August 2024", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittitis eros. Quisque quis euismod lorem.", link: "https://example.com" },
        { title: "Title", authors: "lorem ipsum", date: "August 2024", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittitis eros. Quisque quis euismod lorem.", link: "https://example.com" },
        { title: "Title", authors: "lorem ipsum", date: "August 2024", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittitis eros. Quisque quis euismod lorem.", link: "https://example.com" },
        { title: "Title", authors: "lorem ipsum", date: "August 2024", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittitis eros. Quisque quis euismod lorem.", link: "https://example.com" },
        { title: "Title", authors: "lorem ipsum", date: "August 2024", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittitis eros. Quisque quis euismod lorem.", link: "https://example.com" },
    ];

    return (
        <Box className="flex flex-col items-center justify-center w-full py-10 px-6">
            <Typography variant="h4" className="font-bold text-center mb-24">
                Model Overview
            </Typography>

            {/* A.1 - A.3  */}
            <Grid2 container spacing={6} justifyContent="center" className="w-full justify-center pt-10 px-4">
                {modelSteps.map((step) => (
                    <Grid2 key={step.id} width="30%">
                        <Card onClick={step.onClick}
                              sx={{backgroundColor: selectedStepId === step.id ? '#2449A8' : 'white',
                                  color: selectedStepId === step.id ? 'white' : 'black',}}
                              className="p-4 w-full min-h-[150px] flex flex-col justify-between items-center rounded-lg text-center shadow-xl">
                            <CardContent className="flex flex-col items-center w-full">
                                <Typography variant="h6" className="font-bold">
                                    {step.id}
                                </Typography>
                                <Typography variant="body1">{step.title}</Typography>
                                <Typography variant="body2" className={`transition-colors duration-100 ${selectedStepId === step.id ? "text-gray-300" : "text-gray-500"}`}>
                                    {step.subtitle}
                                </Typography>
                            </CardContent>
                            <Divider className="w-full my-2" />
                            <CardContent className="bg-black p-3 w-full text-sm text-white rounded-md">
                                {step.tooltip}
                            </CardContent>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>


            {/* new content after click A.1 */}
            {expanded1 && (
                <>
                    <div className="w-full h-[1px] bg-black mt-10"></div>

                    {/* B-G: */}
                    <Grid2 container spacing={6} justifyContent="flex-start" className="w-full justify-center pt-10 px-4">
                        {expandedModelSteps.map((step, index) => (
                            <Grid2 key={step.id} width="22%" sx={{ position: 'relative' }}>
                                <Card className="p-4 w-full min-h-[150px] flex flex-col justify-between items-center rounded-lg text-center shadow-xl">
                                    <CardContent className="flex flex-col items-center w-full">
                                        <Typography variant="h6" className="font-bold">
                                            {step.id}
                                        </Typography>
                                        <Typography variant="body1">{step.title}</Typography>
                                        <Typography variant="body2" className="text-gray-500">
                                            {step.subtitle}
                                        </Typography>
                                    </CardContent>
                                    <Divider className="w-full my-2" />
                                    <CardContent className="bg-black p-3 w-full text-sm text-white rounded-md">
                                        {step.tooltip}
                                    </CardContent>
                                </Card>
                                {index !== expandedModelSteps.length - 1 && (
                                    <svg
                                        width="60"
                                        height="10"
                                        viewBox="0 0 80 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="absolute right-[-64px] top-[calc(50%-5px)] transform -translate-y-1/2"
                                    >
                                        <line x1="0" y1="5" x2="40" y2="5" stroke="black" strokeWidth="4" />
                                        <polygon points="40,0 58,5 40,10" fill="black" />
                                    </svg>
                                )}
                            </Grid2>
                        ))}

                    </Grid2>
                </>
            )}

            {/* new content after click A.2 */}
            {expanded2 && (
                <>
                    <div className="w-full h-[1px] bg-black mt-10"></div>

                    {/* B-G: */}
                    <Grid2 container spacing={6} justifyContent="flex-start" className="w-full justify-center pt-10 px-4">
                        {expandedModelSteps2.map((step, index) => (
                            <Grid2 key={step.id} width="22%" sx={{ position: 'relative' }}>
                                <Card className="p-4 w-full min-h-[150px] flex flex-col justify-between items-center rounded-lg text-center shadow-xl">
                                    <CardContent className="flex flex-col items-center w-full">
                                        <Typography variant="h6" className="font-bold">
                                            {step.id}
                                        </Typography>
                                        <Typography variant="body1">{step.title}</Typography>
                                        <Typography variant="body2" className="text-gray-500">
                                            {step.subtitle}
                                        </Typography>
                                    </CardContent>
                                    <Divider className="w-full my-2" />
                                    <CardContent className="bg-black p-3 w-full text-sm text-white rounded-md">
                                        {step.tooltip}
                                    </CardContent>
                                </Card>
                                {index !== expandedModelSteps2.length - 1 && (
                                    <svg
                                        width="60"
                                        height="10"
                                        viewBox="0 0 80 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="absolute right-[-64px] top-[calc(50%-5px)] transform -translate-y-1/2"
                                    >
                                        <line x1="0" y1="5" x2="40" y2="5" stroke="black" strokeWidth="4" />
                                        <polygon points="40,0 58,5 40,10" fill="black" />
                                    </svg>
                                )}
                            </Grid2>
                        ))}
                    </Grid2>
                </>
            )}

            {/* new content after click A.3 */}
            {expanded3 && (
                <>
                    <div className="w-full h-[1px] bg-black mt-10"></div>

                    {/* B-G: */}
                    <Grid2 container spacing={6} justifyContent="flex-start" className="w-full justify-center pt-10 px-4">
                        {expandedModelSteps3.map((step, index) => (
                            <Grid2 key={step.id} width="22%" sx={{ position: 'relative' }}>
                                <Card className="p-4 w-full min-h-[150px] flex flex-col justify-between items-center rounded-lg text-center shadow-xl">
                                    <CardContent className="flex flex-col items-center w-full">
                                        <Typography variant="h6" className="font-bold">
                                            {step.id}
                                        </Typography>
                                        <Typography variant="body1">{step.title}</Typography>
                                        <Typography variant="body2" className="text-gray-500">
                                            {step.subtitle}
                                        </Typography>
                                    </CardContent>
                                    <Divider className="w-full my-2" />
                                    <CardContent className="bg-black p-3 w-full text-sm text-white rounded-md">
                                        {step.tooltip}
                                    </CardContent>
                                </Card>
                                {index !== expandedModelSteps3.length - 1 && (
                                    <svg
                                        width="60"
                                        height="10"
                                        viewBox="0 0 80 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="absolute right-[-64px] top-[calc(50%-5px)] transform -translate-y-1/2"
                                    >
                                        <line x1="0" y1="5" x2="40" y2="5" stroke="black" strokeWidth="4" />
                                        <polygon points="40,0 58,5 40,10" fill="black" />
                                    </svg>
                                )}
                            </Grid2>
                        ))}
                    </Grid2>
                </>
            )}

            {/* The line */}
            <div className="w-full h-[1px] bg-black mt-10"></div>


            {/* Claimchart */}
            <div className="flex flex-col items-center w-full p-4 mt-10">
                {/* Head */}
                <h1 className="text-2xl font-bold mb-4 text-center">Explore claims by topic below</h1>
                {/* Chart */}
                <div className="w-full max-w-[95%] flex justify-center">
                    <ClaimsChart />
                </div>
            </div>

            <div className="w-full p-10">
                {/* header */}
                <h1 className="text-3xl font-bold text-center mb-8">Research Papers</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {researchPapers.map((paper, index) => (
                        <div key={index} className="bg-gray-100 p-6 shadow-lg rounded-lg">
                            <h2 className="text-xl font-bold mb-2">{paper.title}</h2>
                            <p className="text-gray-700">Authors: {paper.authors}</p>
                            <p className="text-gray-900 font-bold">Date: {paper.date}</p>
                            <p className="text-gray-600 mt-2">{paper.description}</p>
                            <a
                                href={paper.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Know More
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </Box>

    );
}
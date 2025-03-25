"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import React from "react";
import { ClaimsChart } from "../_components/claimschart";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";

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
  const expandedModelSteps = expanded1
    ? [
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
      ]
    : [];

  // Content after A.2 is clicked
  const expandedModelSteps2 = expanded2
    ? [
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
      ]
    : [];

  // Content after A.3 is clicked
  const expandedModelSteps3 = expanded3
    ? [
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
      ]
    : [];

  const researchPapers = [
    {
      title: "Title",
      authors: "lorem ipsum",
      date: "August 2024",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittitis eros. Quisque quis euismod lorem.",
      link: "https://example.com",
    },
    {
      title: "Title",
      authors: "lorem ipsum",
      date: "August 2024",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittitis eros. Quisque quis euismod lorem.",
      link: "https://example.com",
    },
    {
      title: "Title",
      authors: "lorem ipsum",
      date: "August 2024",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittitis eros. Quisque quis euismod lorem.",
      link: "https://example.com",
    },
    {
      title: "Title",
      authors: "lorem ipsum",
      date: "August 2024",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittitis eros. Quisque quis euismod lorem.",
      link: "https://example.com",
    },
    {
      title: "Title",
      authors: "lorem ipsum",
      date: "August 2024",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittitis eros. Quisque quis euismod lorem.",
      link: "https://example.com",
    },
    {
      title: "Title",
      authors: "lorem ipsum",
      date: "August 2024",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittitis eros. Quisque quis euismod lorem.",
      link: "https://example.com",
    },
  ];

  return (
    <Box className="flex w-full flex-col items-center justify-center px-6 py-10">
      <Typography variant="h4" className="mb-24 text-center font-bold">
        Model Overview
      </Typography>

      <Typography variant="body1" sx={{ width: "85%", textAlign: "center" }}>
        Our model checks climate-related claims by gathering two types of data:
        verified facts and unverified claims. We collect verified facts via a
        tool called Google Fact Check API and gather unverified claims from
        Reddit and other websites. These claims are then evaluated for
        trustworthiness. Only those with a high level of credibility are shown
        on our site. <strong>Click</strong> on the cards below to learn more
        about how we gather and process this information.
      </Typography>

      {/* A.1 - A.3  */}
      <Grid2
        container
        spacing={6}
        justifyContent="center"
        className="w-full justify-center px-4 pt-10"
      >
        {modelSteps.map((step) => (
          <Grid2 key={step.id} width="30%">
            <Card
              onClick={step.onClick}
              sx={{
                backgroundColor:
                  selectedStepId === step.id ? "#2449A8" : "white",
                color: selectedStepId === step.id ? "white" : "black",
                opacity: selectedStepId === null ? 1 : selectedStepId === step.id ? 1 : 0.3,
  
              }}
              className="flex min-h-[150px] w-full flex-col items-center justify-between rounded-lg p-4 text-center shadow-xl"
            >
              <CardContent className="flex w-full flex-col items-center">
                <Typography variant="h6" className="font-bold">
                  {step.id}
                </Typography>
                <Typography variant="body1">{step.title}</Typography>
                <Typography
                  variant="body2"
                  className={`transition-colors duration-100 ${selectedStepId === step.id ? "text-gray-300" : "text-gray-500"}`}
                >
                  {step.subtitle}
                </Typography>
              </CardContent>
              <Divider className="my-2 w-full" />
              <CardContent className="w-full rounded-md bg-black p-3 text-sm text-white">
                {step.tooltip}
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* new content after click A.1 */}
      {expanded1 && (
        <>
          <div className="mt-10 h-[1px] w-full bg-black"></div>

          {/* B-G: */}
          <Grid2
            container
            spacing={6}
            justifyContent="flex-start"
            className="w-full justify-center px-4 pt-10"
          >
            {expandedModelSteps.map((step, index) => (
              <Grid2 key={step.id} width="22%" sx={{ position: "relative" }}>
                <Card className="flex min-h-[150px] w-full flex-col items-center justify-between rounded-lg p-4 text-center shadow-xl">
                  <CardContent className="flex w-full flex-col items-center">
                    <Typography variant="h6" className="font-bold">
                      {step.id}
                    </Typography>
                    <Typography variant="body1">{step.title}</Typography>
                    <Typography variant="body2" className="text-gray-500">
                      {step.subtitle}
                    </Typography>
                  </CardContent>
                  <Divider className="my-2 w-full" />
                  <CardContent className="w-full rounded-md bg-black p-3 text-sm text-white">
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
                    className="absolute right-[-64px] top-[calc(50%-5px)] -translate-y-1/2 transform"
                  >
                    <line
                      x1="0"
                      y1="5"
                      x2="40"
                      y2="5"
                      stroke="black"
                      strokeWidth="4"
                    />
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
          <div className="mt-10 h-[1px] w-full bg-black"></div>

          {/* B-G: */}
          <Grid2
            container
            spacing={6}
            justifyContent="flex-start"
            className="w-full justify-center px-4 pt-10"
          >
            {expandedModelSteps2.map((step, index) => (
              <Grid2 key={step.id} width="22%" sx={{ position: "relative" }}>
                <Card className="flex min-h-[150px] w-full flex-col items-center justify-between rounded-lg p-4 text-center shadow-xl">
                  <CardContent className="flex w-full flex-col items-center">
                    <Typography variant="h6" className="font-bold">
                      {step.id}
                    </Typography>
                    <Typography variant="body1">{step.title}</Typography>
                    <Typography variant="body2" className="text-gray-500">
                      {step.subtitle}
                    </Typography>
                  </CardContent>
                  <Divider className="my-2 w-full" />
                  <CardContent className="w-full rounded-md bg-black p-3 text-sm text-white">
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
                    className="absolute right-[-64px] top-[calc(50%-5px)] -translate-y-1/2 transform"
                  >
                    <line
                      x1="0"
                      y1="5"
                      x2="40"
                      y2="5"
                      stroke="black"
                      strokeWidth="4"
                    />
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
          <div className="mt-10 h-[1px] w-full bg-black"></div>

          {/* B-G: */}
          <Grid2
            container
            spacing={6}
            justifyContent="flex-start"
            className="w-full justify-center px-4 pt-10"
          >
            {expandedModelSteps3.map((step, index) => (
              <Grid2 key={step.id} width="22%" sx={{ position: "relative" }}>
                <Card className="flex min-h-[150px] w-full flex-col items-center justify-between rounded-lg p-4 text-center shadow-xl">
                  <CardContent className="flex w-full flex-col items-center">
                    <Typography variant="h6" className="font-bold">
                      {step.id}
                    </Typography>
                    <Typography variant="body1">{step.title}</Typography>
                    <Typography variant="body2" className="text-gray-500">
                      {step.subtitle}
                    </Typography>
                  </CardContent>
                  <Divider className="my-2 w-full" />
                  <CardContent className="w-full rounded-md bg-black p-3 text-sm text-white">
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
                    className="absolute right-[-64px] top-[calc(50%-5px)] -translate-y-1/2 transform"
                  >
                    <line
                      x1="0"
                      y1="5"
                      x2="40"
                      y2="5"
                      stroke="black"
                      strokeWidth="4"
                    />
                    <polygon points="40,0 58,5 40,10" fill="black" />
                  </svg>
                )}
              </Grid2>
            ))}
          </Grid2>
        </>
      )}

      {/* The line */}
      <div className="mt-10 h-[1px] w-full bg-black"></div>

      {/* Claimchart */}
      <div className="mt-10 flex w-full flex-col items-center p-4">
        {/* Head */}
        <h1 className="mb-4 text-center text-2xl font-bold">
          Explore claims by topic below
        </h1>
        <Typography variant="body1" sx={{ width: "80%", textAlign: "justify" }}>
          Explore climate-related claims grouped into clusters in our AI model.
          Each cluster represents a sub-topic, helping you see how different
          claims are connected. Use the dropdown to filter results, and hover
          over the dots in the visualization to view individual claims.
        </Typography>
        {/* Chart */}
        <div className="flex w-full max-w-[95%] justify-center p-5">
          <ClaimsChart />
        </div>
      </div>

      <div className="w-full p-10">
        {/* header */}
        <h1 className="mb-8 text-center text-3xl font-bold">Research Papers</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {researchPapers.map((paper, index) => (
            <div key={index} className="rounded-lg bg-gray-100 p-6 shadow-lg">
              <h2 className="mb-1 text-xl font-bold">{paper.title}</h2>
              <p className="mb-1 text-gray-700">Authors: {paper.authors}</p>
              <p className="font-bold text-gray-900">Date: {paper.date}</p>
              <p
                className="mt-1 text-gray-600"
                style={{ textAlign: "justify" }}
              >
                {paper.description}
              </p>
              <a
                href={paper.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
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
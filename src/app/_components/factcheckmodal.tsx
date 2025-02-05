"use client";

import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from "@mui/icons-material/Close";
import { type Claim } from "~/server/api/routers/post";
import {useEffect, useState} from "react";

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface FactCheckModalProps {
  open: boolean;
  onClose: () => void;
  claim: Claim;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`vertical-tabpanel-${index}`}
          aria-labelledby={`vertical-tab-${index}`}
          {...other}
      >
        {value === index && (
            <Box sx={{ p: 3 }}>
              <Typography>{children}</Typography>
            </Box>
        )}
      </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}
export function FactCheckModal({ open, onClose, claim }: FactCheckModalProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [similarClaimsList, setSimilarClaimsList] = useState<Claim[]>([]); // Initialize state to store the list of parsed similar claims.

  useEffect(() => {
    // Check if `claim.similar_claims` exists (not null or undefined).
    if (claim.similar_claims) {
      // Parse `claim.similar_claims` string only when `claim.similar_claims` changes.
      const parsedClaims = claim.similar_claims
          .split(/claim:/i) // Split the string by the keyword "claim:" (case-insensitive).
          .filter((chunk) => chunk.trim() !== "") // Remove any empty items from the split array.
          .map((chunk) => {
            // For each portion, further split it by "Predicted Veracity:".
            const [textPart, veracityPart] = chunk.split(/Predicted Veracity:/i);
            if (!textPart || !veracityPart) return null; // If either part is missing, discard the invalid entry.
            return {
              text: textPart.trim(), // Store the claim text after trimming whitespace.
              cleaned_predict_veracity: veracityPart.trim() === "True" ? "True" : "False", // Parse veracity as "True" or "False".
              explanation: "", // Default value or placeholder for explanation.
              similar_claims: "", // Empty field as a placeholder for similar claims.
              source: "", // Default value or placeholder for source.
            } as Claim; // Explicitly cast the object as a Claim type.
          })
          .filter((item): item is Claim => item !== null); // Filter out null values to ensure only valid Claim objects remain.

      setSimilarClaimsList(parsedClaims); // Update the React state with the parsed claims.
    }
  }, [claim.similar_claims]); // Dependency array ensures this effect runs only when `claim.similar_claims` changes.

  return (
      <Modal open={open} onClose={onClose} aria-labelledby="fact-check-modal">
        {/* 固定宽度的 Modal 卡片 */}
        <Box
            className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl"
            sx={{
              height: '600px', // 固定高度
              maxHeight: '90vh', // 最大高度（适配小屏幕）
              overflow: 'hidden', // 防止内容超出
              display: 'flex',
              flexDirection: 'column', // 内部布局
            }}
        >

          {/* 顶部部分 */}
          <Box className="mb-4 flex items-center justify-between">
            <Typography variant="h6" component="h2">
              Fact Check
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>


          {/* Tabs 和内容的容器 */}
          <Box
              sx={{
                display: 'flex', // 保持 Tabs 和 Tab 内容横向排列
                flexDirection: 'row',
                flexGrow: 1,
                gap: 2, // 增加 Tabs 与内容之间的间距
                width: '100%', // 宽度填满 Modal
              }}
          >
            {/* Tabs 部分，宽度自适应 */}
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{
                  borderRight: 1,
                  borderColor: 'divider',
                  '.MuiTab-root': {
                    whiteSpace: 'normal', // Tab 名称自动换行
                    textAlign: 'left', // 文字左对齐
                  },
                }}
            >
              <Tab label="Fact Check" {...a11yProps(0)} />
              <Tab label="Explanation" {...a11yProps(1)} />
              <Tab label="Similar Claims" {...a11yProps(2)} />
            </Tabs>

            {/* 内容部分，宽度固定 */}
            <Box
                sx={{
                  flexGrow: 1,
                  minWidth: '500px', // Tab 内容部分最小宽度固定
                  maxWidth: '500px', // 最大宽度固定
                  overflow: 'auto', // 避免内容超出
                }}
            >
              <TabPanel value={value} index={0}>

                <Box
                    className="overflow-y-scroll"
                    style={{
                      maxHeight: '500px',
                      overflowY: 'auto',
                    }}
                >
                  <Typography className="mb-6 text-lg">{claim.text}</Typography>
                  <Box className="mb-4 flex items-center gap-4">
                    <Box className="rounded bg-blue-700 px-8 py-2 text-white">
                      {claim.cleaned_predict_veracity}
                    </Box>
                    <Typography variant="h6">Based On Our Model</Typography>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel value={value} index={1}>
                <Box className="mb-6">
                  <Typography className="mb-6 text-gray-600">{claim.explanation}</Typography>
                </Box>
              </TabPanel>

              <TabPanel value={value} index={2}>
                <Typography variant="subtitle2" className="mb-2">Similar Claims:</Typography>
                <Box
                    className="overflow-y-scroll"
                    style={{
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}
                >
                  {similarClaimsList.map((similarClaim, index) => (
                      <Box key={index} className="mb-2 p-2 border rounded">
                        <Typography>
                          <strong>Claim:</strong> {similarClaim.text}
                        </Typography>
                        <Typography>
                          <strong>Predicted Veracity:</strong> {similarClaim.cleaned_predict_veracity}
                        </Typography>
                      </Box>
                  ))}
                </Box>
                <Button href="#" className="text-blue-600 hover:underline">
                  {claim.source}
                </Button>
              </TabPanel>
            </Box>
          </Box>
        </Box>
      </Modal>
  );
}

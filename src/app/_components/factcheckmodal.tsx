"use client";

import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from "@mui/icons-material/Close";
import { type Claim } from "~/server/api/routers/post";
import {useEffect, useState} from "react";

interface FactCheckModalProps {
  open: boolean;
  onClose: () => void;
  claim: Claim;
}

export function FactCheckModal({ open, onClose, claim }: FactCheckModalProps) {
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
      <Box className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
        <Box className="mb-4 flex items-center justify-between">
          <Typography variant="h6" component="h2">
            Fact Check
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography className="mb-6 text-lg">{claim.text}</Typography>

        <Box className="mb-6">
          <Box className="mb-4 flex items-center gap-4">
            <Box className="rounded bg-blue-700 px-8 py-2 text-white">
              {claim.cleaned_predict_veracity}
            </Box>
            <Typography variant="h6">Based On Our Model</Typography>
          </Box>

          <Typography className="mb-6 text-gray-600">
            {claim.explanation}
          </Typography>
        </Box>

        <Box className="border-t pt-4">
          <Typography variant="subtitle2" className="mb-2">
            Similar Claims:
          </Typography>
          {/*<Typography variant="subtitle2" className="mb-2">*/}
          {/*  {claim.similar_claims}*/}
          {/*</Typography>*/}
          {/* 滚动容器 */}
          <Box
              className="overflow-y-scroll" // TailwindCSS 的滚动样式
              style={{
                maxHeight: "200px", // 限制滚动区域的高度（可以调整）
                overflowY: "auto", // 启用垂直滚动
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
        </Box>

        <Box className="mt-4 flex gap-2">
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

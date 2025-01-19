"use client";

import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { type Claim } from "~/server/api/routers/post";

interface FactCheckModalProps {
  open: boolean;
  onClose: () => void;
  claim: Claim;
}

export function FactCheckModal({ open, onClose, claim }: FactCheckModalProps) {
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
            {claim.similar_claims}
          </Typography>
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

"use client";

import { useState } from "react";
import { Box, Typography, Slider, Button } from "@mui/material";

export default function Page() {
  const [similarity, setSimilarity] = useState<number>(100);

  return (
    <Box className="flex min-h-screen w-full">
      <Box className="flex w-full max-w-4xl flex-col gap-8 p-8">
        <Box className="flex flex-col gap-4">
          <Typography variant="h4" className="font-bold">
            We Need Your Help: Join the Community to Verify Information
          </Typography>

          <Typography className="text-gray-700">
            Become part of a global community dedicated to fact-checking,
            sharing knowledge, and combating misinformation. Your volunteering
            effort can make a real impact
          </Typography>

          <Typography className="text-gray-600">Step 1/3</Typography>
        </Box>

        <Box className="flex flex-col gap-6">
          <Typography variant="h6" className="font-medium">
            Rate each pair of claims based on their similarity in views on
            climate change. Use the provided scale and click Next Step to
            proceed
          </Typography>

          <Box className="flex flex-col gap-4 rounded-lg bg-gray-50 p-6">
            <Typography className="text-gray-800">
              Charles David Keeling, of Scripps Institution of Oceanography at
              UC San Diego, was the first person to make frequent regular
              measurements of atmospheric CO 2 concentrations at the South Pole,
              and on Mauna Loa, Hawaii from March 1958 onwards.
            </Typography>

            <Typography className="text-gray-800">
              While traditionally load balancing strategies have been designed
              to change consumers consumption patterns to make demand more
              uniform, developments in energy storage and individual renewable
              energy generation have provided opportunities to devise balanced
              power grids without affecting consumers behavior.
            </Typography>

            <Box className="mt-4">
              <Slider
                value={similarity}
                onChange={(_, newValue) => setSimilarity(newValue as number)}
                aria-labelledby="similarity-slider"
                valueLabelDisplay="auto"
                marks={[
                  { value: 0, label: "0" },
                  { value: 25, label: "25" },
                  { value: 50, label: "50" },
                  { value: 75, label: "75" },
                  { value: 100, label: "100" },
                ]}
                sx={{
                  "& .MuiSlider-track": {
                    backgroundColor: "#6b46c1",
                  },
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#6b46c1",
                  },
                }}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            className="mt-4 w-full bg-blue-700 py-3 text-white hover:bg-blue-800"
            onClick={() => console.log("Next step clicked")}
          >
            NEXT STEP
          </Button>
        </Box>
      </Box>

      <Box className="w-full max-w-md bg-gray-50 p-8">
        <Typography variant="h6" className="mb-4">
          Have questions or thoughts to share?
        </Typography>
        <Typography>
          We want to hear from you! Reach out to us at myfactwiki@gmail.com
        </Typography>
      </Box>
    </Box>
  );
}

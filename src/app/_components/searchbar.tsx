"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Autocomplete,
  TextField,
  createFilterOptions,
  CircularProgress,
  Button,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "~/trpc/react";
import { FactCheckModal } from "~/app/_components/factcheckmodal";
import {
  type Claim,
  type PostRealTimeInferenceResponse,
} from "~/server/api/routers/post";
import PropTypes from "prop-types";

function CircularProgressWithLabel(props) {
  return (
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
        >
          <Typography
              variant="caption"
              component="div"
              sx={{ color: "text.secondary" }}
          >
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};


export function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [searchValueInference, setSearchValueInferece] = useState("");
  const [searchOptions, setSearchOptions] = useState<(Claim | undefined)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | undefined>(
    undefined,
  );
  const [makeRequestForClaims, setMakeRequestForClaims] = useState(
    searchOptions.length === 0,
  );
  const [inferenceResponse, setInferenceResponse] =
    useState<PostRealTimeInferenceResponse | null>(null);
  const [isLoadingInference, setIsLoadingInference] = useState(false);

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 50,
  });

  const options = api.post.listClaims.useQuery(undefined, {
    enabled: makeRequestForClaims,
  });

  useEffect(() => {
    // Filter options.data to the unique claims using text
    if (options.data) {
      const uniqueClaims = Array.from(
        new Set(options.data.map((claim) => claim.text)),
      ).map((text) => {
        return options.data.find((claim) => claim.text === text);
      });
      if (uniqueClaims) {
        setMakeRequestForClaims(false);

        uniqueClaims.sort((a, b) => {
          if (a?.cluster === undefined) return -1;
          if (b?.cluster === undefined) return 1;
          return b.cluster - a.cluster;
        });

        setSearchOptions(uniqueClaims);
      }
    }
  }, [options.data]);

  const mutation = api.post.postRealTimeInference.useMutation();

  const query = api.post.getRealTimeInferenceUpdate.useMutation();

  const handleSubmit = async (claim: string) => {
    setIsLoadingInference(true);
    try {
      console.log("Starting submit...");
      const response: PostRealTimeInferenceResponse =
        await mutation.mutateAsync({
          text: claim,
        });
      if (!response.is_check_worthy) {
        setIsLoadingInference(false);
        setInferenceResponse(response);
        return response;
      }

      let checkUpdate = await query.mutateAsync({
        id: response.uuid,
      });
      while (checkUpdate.isFound === false) {
        console.log("Waiting for update...");
        await new Promise((resolve) => setTimeout(resolve, 4000));
        checkUpdate = await query.mutateAsync({
          id: response.uuid,
        });
      }

      console.log("Data submitted successfully!");
      setIsLoadingInference(false);
      setInferenceResponse(checkUpdate);
      return checkUpdate;
    } catch (error) {
      console.error("Failed to submit data", error);
      setIsLoadingInference(false);
      setInferenceResponse({
        claim: {} as Claim,
        is_check_worthy: false,
        check_worthiness_score: 0,
        uuid: "error",
        isFound: false,
      });
    }
  };

  // State for progress bar
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);

// Effect to handle progress update
  useEffect(() => {
    if (isLoadingInference) {
      const delayShowProgress = setTimeout(() => {
        setShowProgressBar(true);
      }, 1500);

      setProgress(0);
      let timeElapsed = 0;
      const interval = setInterval(() => {
        setProgress(() => {
          const k = 0.07;
          const newProgress = 70 * (1 - Math.exp(-k * timeElapsed)) + 30;
          return Math.min(100, newProgress);
        });

        timeElapsed += 0.5;
        if (timeElapsed >= 4) {
          setShowText(true);
        }
      }, 1500);

      return () => {
        clearTimeout(delayShowProgress);
        clearInterval(interval);
      };
    } else {
      const hideTimeout = setTimeout(() => {
        setShowProgressBar(false);
      }, 300);

      return () => clearTimeout(hideTimeout);
    }
  }, [isLoadingInference]);



// At the end of isLoadingInference make sure progress to be 100
  useEffect(() => {
    if (!isLoadingInference) {
      setProgress(100);
    }
  }, [isLoadingInference]);


  return (
      <Box className="flex h-screen w-full flex-col items-center bg-white pt-[80px]">
        {searchOptions.length === 0 && (
            <Box className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
              <CircularProgress />
            </Box>
        )}
        <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "18px", marginBottom: "20px" }}
        >
          Get the facts on climate change—type below to search for claims and check their accuracy!
        </Typography>

        <Button
            variant="contained"
            className="w-1/6 bg-blue-700 text-white hover:bg-blue-800"
            onClick={async () => {
              if (searchValueInference.length === 0) return;
              setProgress(0);
              setShowText(false);
              setIsLoadingInference(true);
              await handleSubmit(searchValueInference);
            }}
        >
          Generate prediction
          {isLoadingInference && (
              <CircularProgress size={24} className="ml-2" color="secondary" />
          )}
        </Button>

        <Box className="flex w-full max-w-[800px] items-center px-2 py-8">
          <Box className="flex w-full items-center rounded">
            <SearchIcon className="ml-2 text-gray-500" />
            <Autocomplete
                noOptionsText={"No matches... Check the veracity by clicking the button above!"}
                fullWidth
                onInputChange={(_, newInputValue) => {
                  if (newInputValue.length > 0) {
                    setSearchValueInferece(newInputValue);
                    setSearchValue(newInputValue);
                  }
                }}
                value={searchValue}
                filterOptions={filterOptions}
                options={searchOptions.map((option) => option?.text ?? "")}
                onChange={(_, newValue) => {
                  setSearchValue(newValue! || "");
                  const claim = searchOptions.find((option) => option?.text === newValue);
                  if (!claim) return;
                  setSelectedClaim(claim);
                  setIsModalOpen(true);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Try searching for 'solar' or 'wind'"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderColor: "#0B4797",
                            "& fieldset": { borderColor: "#0B4797", borderWidth: "2px" },
                            "&:hover fieldset": { borderColor: "#0B4797", borderWidth: "3px" },
                            "&.Mui-focused fieldset": { borderColor: "#0B4797", borderWidth: "3px" },
                          },
                        }}
                    />
                )}
            />
          </Box>
        </Box>

        {showProgressBar && (
            <Box sx={{ width: "100%", maxWidth: "800px", mt: 2, textAlign: "center" }}>
              <CircularProgressWithLabel value={progress} />
              {showText && (
                  <Typography
                      variant="h6"
                      color="textSecondary"
                      sx={{ mt: 1, fontWeight: "bold", textAlign: "center" }}
                  >
                    Please wait for about 30 seconds, our model is analyzing the claim...
                  </Typography>
              )}
            </Box>
        )}

        {inferenceResponse && (
            <Box className="mt-4">
              <Typography color="red">
                Is Claim Checkworthy? {inferenceResponse.is_check_worthy ? "Yes" : "No"}
              </Typography>
              <Typography color="red">
                Checkworthy Score: {inferenceResponse.check_worthiness_score}
              </Typography>
            </Box>
        )}

          {/* Example for inference */}
          <Box className="flex flex-col items-start w-full max-w-[720px] mt-4 gap-2">
              <Typography variant="body1" color="textSecondary">
                  Example:
              </Typography>
              <Button
                  variant="outlined"
                  className="px-4 py-2"
                  onClick={async () => {
                      const exampleText = "I am happy";
                      setSearchValueInferece(exampleText);
                      setSearchValue(exampleText);
                      setProgress(0);
                      setShowText(false);
                      setIsLoadingInference(true);
                      await handleSubmit(exampleText);
                  }}
              >
                  I am happy
              </Button>
              <Button
                  variant="outlined"
                  className="px-4 py-2"
                  onClick={async () => {
                      const exampleText = "I am excited";
                      setSearchValueInferece(exampleText);
                      setSearchValue(exampleText);
                      setProgress(0);
                      setShowText(false);
                      setIsLoadingInference(true);
                      await handleSubmit(exampleText);
                  }}
              >
                  I am excited
              </Button>
              <Button
                  variant="outlined"
                  className="px-4 py-2"
                  onClick={async () => {
                      const exampleText = "I am curious";
                      setSearchValueInferece(exampleText);
                      setSearchValue(exampleText);
                      setProgress(0);
                      setShowText(false);
                      setIsLoadingInference(true);
                      await handleSubmit(exampleText);
                  }}
              >
                  I am curious
              </Button>
          </Box>




          {selectedClaim && (
            <FactCheckModal open={isModalOpen} claim={selectedClaim} onCloseAction={() => setIsModalOpen(false)} />
        )}
      </Box>
  );
}

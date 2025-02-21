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
        prediction: "error",
        explanation: "error",
        similar_claims: "error",
        claim: "error",
        cluster_name: "error",
        is_check_worthy: false,
        check_worthiness_score: 0,
        uuid: "error",
        isFound: false,
      });
    }
  };

  return (
    <Box className="flex h-screen w-full flex-col items-center bg-white pt-[80px]">
      {searchOptions.length === 0 && (
        <Box className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          <CircularProgress />
        </Box>
      )}
      <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "18px", marginBottom: "20px" }}>
        Get the facts on climate change—type a claim to check its accuracy!
      </Typography>


      <Button
        variant="contained"
        className="w-1/6 bg-blue-700 text-white hover:bg-blue-800"
        onClick={async () => {
          if (searchValueInference.length === 0) return;
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
              noOptionsText={
                "No matches... Check the veracity by clicking the button above!"
              }
              fullWidth
              onInputChange={(_, newInputValue) => {
                if (newInputValue.length > 0) {
                  setSearchValueInferece(newInputValue);
                  setSearchValue(newInputValue);
                }
                return;
              }}
              value={searchValue}
              filterOptions={filterOptions}
              options={searchOptions.map((option) => {
                if (!option) return "";
                return option.text ?? "";
              })}
              onChange={(_, newValue) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                setSearchValue(newValue! || "");
                const claim = searchOptions.find((option) => {
                  if (!option) return false;
                  return option.text === newValue;
                });
                if (!claim) return;
                setSelectedClaim(claim);
                setIsModalOpen(true);
              }}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Try searching for 'hurricane' or 'windmill'"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderColor: "#0B4797",
                          "& fieldset": { borderColor: "#0B4797", borderWidth: "2px" },
                          "&:hover fieldset": { borderColor: "#0B4797", borderWidth: "3px" },
                          "&.Mui-focused fieldset": { borderColor: "#0B4797", borderWidth: "3px" }
                        }
                      }}
                  />

              )}
              renderOption={(props, option) => {
                const claim = searchOptions.find((c) => c?.text === option);
                if (!claim) return null;
                return (
                    <li
                        {...props}
                        key={claim.text}
                        className="flex justify-between w-full px-3 py-2"
                    >
                      <Typography variant="body1" className="truncate w-3/5">
                        {claim.text}
                      </Typography>
                      <Box className="flex w-2/5 justify-end space-x-2">
                        <Typography
                            variant="body2"
                            className="bg-gray-200 px-2 py-1 rounded w-[80px] flex items-center justify-center text-center flex-shrink-0"
                        >
                          Model: {claim.cleaned_predict_veracity}
                        </Typography>
                        <Typography
                            variant="body2"
                            className="bg-gray-300 px-2 py-1 rounded w-[80px] flex items-center justify-center text-center flex-shrink-0"
                        >
                          Truth: {claim.cleaned_veracity}
                        </Typography>
                        {claim.source.startsWith("http") ? (
                            <Button
                                href={claim.source}
                                style={{ textTransform: "none" }}
                                className="!bg-gray-300 px-2 py-1 rounded w-[80px] flex-shrink-0 normal-case hover:bg-gray-400 active:bg-gray-500 focus:outline-none justify-start text-black"
                            >
                              Source
                            </Button>
                        ) : (
                            <Typography
                                variant="body2"
                                className="bg-gray-300 px-2 py-1 rounded w-[80px] flex items-center justify-center text-center flex-shrink-0"
                            >
                              {claim.source}
                            </Typography>
                        )}
                      </Box>
                    </li>
                );
              }}
          />
        </Box>
      </Box>
      {inferenceResponse && (
        <Box className="mt-4">
          <Typography color="red">
            Is Claim Checkworthy?{" "}
            {inferenceResponse.is_check_worthy ? "Yes" : "No"}
          </Typography>
          <Typography color="red">
            Checkworthy Score: {inferenceResponse.check_worthiness_score}
          </Typography>
          <Typography color="red">
            Prediction: {inferenceResponse.prediction}
          </Typography>
          <Typography color="red">
            Explanation: {inferenceResponse.explanation}
          </Typography>
          <Typography color="red">
            Similar Claims: {inferenceResponse.similar_claims}
          </Typography>
          <Typography color="red">Claim: {inferenceResponse.claim}</Typography>
          <Typography color="red">
            Cluster Name: {inferenceResponse.cluster_name}
          </Typography>
        </Box>
      )}
      {selectedClaim && (
        <FactCheckModal
          open={isModalOpen}
          claim={selectedClaim}
          onCloseAction={() => setIsModalOpen(false)}
        />
      )}
    </Box>
  );
}

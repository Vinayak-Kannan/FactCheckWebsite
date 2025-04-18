// Final fixed version of the SearchBar component with full functionality restored
"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Autocomplete,
    TextField,
    CircularProgress,
    Button,
    Typography,
} from "@mui/material";
import type { CircularProgressProps } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import { api } from "~/trpc/react";
import { FactCheckModal } from "~/app/_components/factcheckmodal";
import {
    type Claim,
    type PostRealTimeInferenceResponse,
} from "~/server/api/routers/post";
import PropTypes from "prop-types";

interface CircularProgressWithLabelProps extends CircularProgressProps {value: number;}

function CircularProgressWithLabel(props: CircularProgressWithLabelProps) {
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
    const [inputText, setInputText] = useState("");
    const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
    const [searchOptions, setSearchOptions] = useState<(Claim | undefined)[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
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

    const options = api.post.listClaims.useQuery(undefined, {
        enabled: makeRequestForClaims,
    });

    useEffect(() => {
        // Filter options.data to the unique claims using text
        if (options.data) {
            const uniqueClaims = Array.from(
                new Set(options.data.map((claim) => claim.text)),
            ).map((text) => options.data.find((claim) => claim.text === text));

            if (uniqueClaims) {
                setMakeRequestForClaims(false);
                uniqueClaims.sort((a, b) => {
                    if (a?.cluster === undefined) return -1;
                    if (b?.cluster === undefined) return 1;
                    return b.cluster - a.cluster;
                });

                setSearchOptions(uniqueClaims);
                setFilteredOptions(uniqueClaims.map((c) => c?.text ?? ""));
            }
        }
    }, [options.data]);

    const mutation = api.post.postRealTimeInference.useMutation();
    const query = api.post.getRealTimeInferenceUpdate.useMutation();

    const handleSubmit = async (claim: string) => {
        setIsLoadingInference(true);
        try {
            const response = await mutation.mutateAsync({text: claim});
            if (!response.is_check_worthy) {
                setIsLoadingInference(false);
                setInferenceResponse(response);
                return response;
            }
            let checkUpdate = await query.mutateAsync({id: response.uuid});
            while (!checkUpdate.isFound) {
                await new Promise((resolve) => setTimeout(resolve, 4000));
                checkUpdate = await query.mutateAsync({id: response.uuid});
            }
            setIsLoadingInference(false);
            setInferenceResponse(checkUpdate);
            setIsModalOpen(true);
            return checkUpdate;
        } catch (error) {
            console.error("Failed to submit data", error);
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
    const handleFilterOptions = () => {
        const filtered = searchOptions
            .filter((opt) => opt?.text.toLowerCase().includes(inputText.toLowerCase()))
            .map((opt) => opt?.text ?? "");
        setFilteredOptions(filtered);
        setIsAutocompleteOpen(true);
    };

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
            <Box className="flex flex-col items-center gap-4 mt-4">
                <Button
                    variant="contained"
                    color="secondary"
                    href="/community"
                    sx={{
                        backgroundColor: "#8B5CF6",
                        '&:hover': { backgroundColor: "#7C3AED" },
                        color: "white",
                        fontWeight: "bold",
                        paddingX: 3,
                        paddingY: 1,
                        textTransform: "none",
                    }}
                >
                    💡 Want to Help? Click Here to Rate Claims
                </Button>

<Button
  variant="contained"
  className="w-[250px] bg-blue-700 text-white hover:bg-blue-800 normal-case"
  sx={{
    paddingY: 1.2,
    fontWeight: "bold",
    fontSize: "14px",
    letterSpacing: "0.5px",
    borderRadius: "6px",
  }}
  onClick={async () => {
    if (inputText.trim().length === 0) return;
    setSearchValueInference(inputText);
    setSearchValue(inputText);
    setProgress(0);
    setShowText(false);
    setIsLoadingInference(true);
    await handleSubmit(inputText);
  }}
>
  Generate Prediction
  {isLoadingInference && (
    <CircularProgress size={24} className="ml-2" color="secondary" />
  )}
</Button>

            <Box className="flex w-full max-w-[800px] items-center px-2 py-8">
                <Box className="flex w-full items-center space-x-2">
                    <SearchIcon className="ml-2 text-gray-500"/>
                    <Autocomplete
                        fullWidth
                        options={filteredOptions}
                        open={isAutocompleteOpen}
                        onClose={() => setIsAutocompleteOpen(false)}
                        inputValue={inputText}
                        value={searchValue}
                        onInputChange={(_, newInputValue) => setInputText(newInputValue)}
                        onChange={(_, selectedText) => {
                            const text = typeof selectedText === "string" ? selectedText : "";
                            setSearchValue(text);
                            setInputText(text);
                            const claim = searchOptions.find((opt) => opt?.text === text);
                            if (claim) {
                                setSelectedClaim(claim);
                                setIsModalOpen(true);
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Is it true that..."
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderColor: "#0B4797",
                                        "& fieldset": { borderColor: "#0B4797", borderWidth: "2px" },
                                        "&:hover fieldset": { borderColor: "#0B4797", borderWidth: "3px" },
                                        "&.Mui-focused fieldset": { borderColor: "#0B4797", borderWidth: "3px" },
                                    },
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" && inputText.trim() !== "") {
                                        event.preventDefault();
                                        setSearchValue(inputText);
                                        handleFilterOptions();
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
                                    className="flex w-full justify-between px-3 py-2"
                                >
                                    <Typography variant="body1" className="w-3/5">
                                        {claim.text}
                                    </Typography>

                                    <Box className="flex w-2/5 justify-end space-x-2">
                                        <Typography
                                            variant="body2"
                                            className={`flex w-[90px] flex-shrink-0 items-center justify-center rounded px-2 py-1 text-center ${
                                                claim.cleaned_predict_veracity?.toLowerCase() === "true"
                                                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                                                    : "bg-blue-50 text-blue-600 border border-blue-200"
                                            }`}
                                        >
                                            Prediction: {claim.cleaned_predict_veracity}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className={`flex w-[100px] flex-shrink-0 items-center justify-center rounded px-2 py-1 text-center font-semibold ${
                                                claim.cleaned_veracity?.toLowerCase() === "true"
                                                    ? "bg-green-200 text-green-900 border border-green-300"
                                                    : "bg-red-200 text-red-900 border border-red-300"
                                            }`}
                                        >
                                            Ground Truth: {claim.cleaned_veracity}
                                        </Typography>
                                        {claim.source.startsWith("http") ? (
                                            <Button
                                                href={claim.source}
                                                style={{ textTransform: "none" }}
                                                className="w-[80px] flex-shrink-0 justify-start rounded !bg-gray-300 px-2 py-1 normal-case text-black hover:bg-gray-400 focus:outline-none active:bg-gray-500"
                                            >
                                                Source
                                            </Button>
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                className="flex w-[80px] flex-shrink-0 items-center justify-center rounded bg-gray-300 px-2 py-1 text-center"
                                            >
                                                {claim.source}
                                            </Typography>
                                        )}
                                    </Box>
                                </li>
                            );
                        }}
                    />
                    <Button
                        variant="contained"
                        sx={{height: "56px", whiteSpace: "nowrap"}}
                        onClick={() => {
                            if (inputText.trim() !== "") {
                                setSearchValue(inputText);
                                handleFilterOptions();
                            }
                        }}
                    >
                        Submit
                    </Button>
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

            {/*{inferenceResponse && (*/}
            {/*    <Box className="mt-4">*/}
            {/*      <Typography color="red">*/}
            {/*        Is Claim Checkworthy?{" "}*/}
            {/*        {inferenceResponse.is_check_worthy ? "Yes" : "No"}*/}
            {/*      </Typography>*/}
            {/*      <Typography color="red">*/}
            {/*        Checkworthy Score: {inferenceResponse.check_worthiness_score}*/}
            {/*      </Typography>*/}
            {/*    </Box>*/}
            {/*)}*/}
            {inferenceResponse && (
                inferenceResponse.is_check_worthy ? (
                    <FactCheckModal
                        open={isModalOpen}
                        claim={inferenceResponse.claim}
                        onCloseAction={() => setIsModalOpen(false)}
                    />
                ) : (
                    <Box className="mt-4">
                        <Typography color="red">
                            Is Claim Checkworthy? {inferenceResponse.is_check_worthy ? "Yes" : "No"}
                        </Typography>
                        <Typography color="red">
                            Checkworthy Score: {inferenceResponse.check_worthiness_score}
                        </Typography>
                    </Box>
                )
            )}

            <Box className="flex flex-col items-start w-full max-w-[720px] mt-4 gap-2">
                <Typography variant="body1" color="textSecondary">
                    Example:
                </Typography>
                <Button
                    variant="outlined"
                    className="px-4 py-2"
                    onClick={async () => {
                        const exampleText = "The United States is currently only contributing 15% of emissions, but we are the largest historical contributor (we have had the most emissions over time).";
                        setSearchValueInferece(exampleText);
                        setSearchValue(exampleText);
                        setInputText(exampleText);
                        setProgress(0);
                        setShowText(false);
                        setIsLoadingInference(true);
                        await handleSubmit(exampleText);
                    }}
                >
                    The United States is currently only contributing 15% of emissions, but we are the largest historical
                    contributor (we have had the most emissions over time).
                </Button>
                <Button
                    variant="outlined"
                    className="px-4 py-2"
                    onClick={async () => {
                        const exampleText = "In September, New York City saw a similar story play out, as 7 inches of rain fell in 24 hours in some locations, submerging cars and city buses and shuttering rail travel., , * Before July 2023, has Vermont *never* experienced intense rainfall or flash flooding?, * Before July 2023, have some locations in New York City *never* had 7 inches of rainfall over a 24-hour period?, , >The consequences of storms are intensified in cities like New York, where storm drains and subway tunnels are in disrepair or were simply built for a more gentle climate..";
                        setSearchValueInferece(exampleText);
                        setSearchValue(exampleText);
                        setInputText(exampleText);
                        setProgress(0);
                        setShowText(false);
                        setIsLoadingInference(true);
                        await handleSubmit(exampleText);
                    }}
                >
                    In September, New York City saw a similar story play out, as 7 inches of rain fell in 24 hours in
                    some locations, submerging cars and city buses and shuttering rail travel., , Before July 2023, has
                    Vermont *never* experienced intense rainfall or flash flooding?, * Before July 2023, have some
                    locations in New York City *never* had 7 inches of rainfall over a 24-hour period?, The consequences
                    of storms are intensified in cities like New York, where storm drains and subway tunnels are in
                    disrepair or were simply built for a more gentle climate..
                </Button>
                <Button
                    variant="outlined"
                    className="px-4 py-2"
                    onClick={async () => {
                        const exampleText = "The US has a little over 200 coal-fired power plants, and the number is shrinking.";
                        setSearchValueInferece(exampleText);
                        setSearchValue(exampleText);
                        setInputText(exampleText);
                        setProgress(0);
                        setShowText(false);
                        setIsLoadingInference(true);
                        await handleSubmit(exampleText);
                    }}
                >
                    The US has a little over 200 coal-fired power plants, and the number is shrinking.
                </Button>
            </Box>

            {selectedClaim && (
                <FactCheckModal open={isModalOpen} claim={selectedClaim} onCloseAction={() => setIsModalOpen(false)} />
            )}
        </Box>
    );
}
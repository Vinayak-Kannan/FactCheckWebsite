"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Autocomplete,
  TextField,
  createFilterOptions,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "~/trpc/react";
import { FactCheckModal } from "~/app/_components/factcheckmodal";
import { type Claim } from "~/server/api/routers/post";

export function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [searchOptions, setSearchOptions] = useState<(Claim | undefined)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | undefined>(
    undefined,
  );
  const [makeRequestForClaims, setMakeRequestForClaims] = useState(
    searchOptions.length === 0,
  );

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

  return (
    <Box className="flex h-screen w-full flex-col items-center bg-white pt-2">
      {searchOptions.length === 0 && (
        <Box className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          <CircularProgress />
        </Box>
      )}
      <Box className="flex w-full max-w-[800px] items-center px-2">
        <Box className="flex w-full items-center rounded border border-gray-200">
          <SearchIcon className="ml-2 text-gray-500" />
          <Autocomplete
            freeSolo
            fullWidth
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
                variant="standard"
                placeholder="Try searching for 'hurricane' or 'windmill'"
              />
            )}
          />
        </Box>
      </Box>
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

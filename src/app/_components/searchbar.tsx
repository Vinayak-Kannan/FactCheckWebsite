"use client";

import { useEffect, useState } from "react";
import { Box, Autocomplete, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "~/trpc/react";
import { FactCheckModal } from "~/app/_components/factcheckmodal";
import { type Claim } from "~/server/api/routers/post";

export function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [searchOptions, setSearchOptions] = useState<Claim[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchData = () => {
      const options = api.post.listClaims.useSuspenseQuery();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setSearchOptions(options);
    };
    fetchData();
  }, []);

  return (
    <Box className="flex h-screen w-full flex-col items-center bg-white pt-2">
      <Box className="flex w-full max-w-[800px] items-center px-2">
        <Box className="flex w-full items-center rounded border border-gray-200">
          <SearchIcon className="ml-2 text-gray-500" />
          <Autocomplete
            freeSolo
            fullWidth
            value={searchValue}
            options={searchOptions.map((option) => {
              return option.text ?? "";
            })}
            onChange={(_, newValue) => {
              setSearchValue(newValue! || "");
              const claim = searchOptions.find(
                (option) => option.text === newValue,
              );
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
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Box>
  );
}

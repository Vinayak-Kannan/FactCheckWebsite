"use client";

import Link from "next/link";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";

export function Navbar() {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/" passHref style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              sx={{
                color: "#663399",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              MyFactWiki
            </Typography>
          </Link>
          <Typography
            sx={{
              color: "#000",
              fontSize: "1rem",
            }}
          >
            Climate
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Link href="/ourmodel" passHref>
            <Button color="inherit" sx={{ color: "#000" }}>
              Our Model
            </Button>
          </Link>
          <Link href="/community" passHref>
            <Button color="inherit" sx={{ color: "#000" }}>
              Community
            </Button>
          </Link>
          <Link href="/about" passHref>
            <Button color="inherit" sx={{ color: "#000" }}>
              About
            </Button>
          </Link>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "20px",
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": {
                borderColor: "#1565c0",
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            }}
          >
            SHARE
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

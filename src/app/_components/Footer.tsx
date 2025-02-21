import { Box, Container, Typography } from "@mui/material";

export const Footer = () => {
    return (
        <Box sx={{ bgcolor: "grey.200", py: 4, mt: 6, textAlign: "center" }}>
            <Container>
                <Typography variant="body2">
                    Copyright © 2024 MyFactWiki
                </Typography>
            </Container>
        </Box>
    );
};
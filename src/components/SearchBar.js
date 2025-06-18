import React from "react";
import { TextField, Button, Box, Paper } from "@mui/material";

const SearchBar = ({ query, setQuery, handleSearch }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
      }}
    >
      <form onSubmit={handleSearch}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Search for recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
            sx={{ backgroundColor: "white", borderRadius: "8px" }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "8px",
            }}
          >
            Search
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default SearchBar;

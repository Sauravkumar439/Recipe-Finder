import React, { useState, useMemo } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Switch,
  FormControlLabel,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { fetchRecipes, fetchRecipeDetails } from "./api/spoonacular";
import SearchBar from "./components/SearchBar";
import RecipeGrid from "./components/RecipeGrid";
import { motion } from "framer-motion";

const App = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#90caf9" : "#1976d2",
          },
          background: {
            default: darkMode ? "#121212" : "#f4f6f8",
          },
        },
        typography: {
          fontFamily: "Roboto, sans-serif",
        },
      }),
    [darkMode]
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setRecipes([]);
    try {
      const results = await fetchRecipes(query);
      setRecipes(results);
      if (results.length === 0) {
        setError("No recipes found.");
      }
    } catch {
      setError("Something went wrong while fetching recipes.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (recipe) => {
    setSelectedRecipe(recipe);
    setModalLoading(true);
    try {
      const details = await fetchRecipeDetails(recipe.id);
      setRecipeDetails(details);
    } catch {
      setRecipeDetails(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
    setRecipeDetails(null);
  };

  const handleFavoriteToggle = (recipe) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === recipe.id);
      return exists
        ? prev.filter((item) => item.id !== recipe.id)
        : [...prev, recipe];
    });
  };

  const displayedRecipes = showFavoritesOnly ? favorites : recipes;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                background: darkMode
                  ? "linear-gradient(135deg, #1e1e1e, #2c3e50)"
                  : "linear-gradient(135deg, #e3f2fd, #ffffff)",
                borderRadius: 3,
                p: { xs: 3, sm: 4 },
                mb: 4,
                textAlign: "center",
                boxShadow: 3,
              }}
            >
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  color: darkMode ? "#90caf9" : "#1976d2",
                }}
              >
                🍲 Recipe Finder
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ mt: 1, color: darkMode ? "#ccc" : "#555" }}
              >
                Discover, save & cook your favorite dishes in seconds
              </Typography>
              <Box mt={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                      color="primary"
                    />
                  }
                  label="Dark Mode"
                />
              </Box>
            </Box>
          </motion.div>

          {/* SearchBar with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Box
              sx={{
                backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
                borderRadius: 2,
                boxShadow: 2,
                p: 3,
                mb: 3,
              }}
            >
              <SearchBar
                query={query}
                setQuery={setQuery}
                handleSearch={handleSearch}
              />
            </Box>
          </motion.div>

          {/* Favorites Button */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant={showFavoritesOnly ? "contained" : "outlined"}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  px: 4,
                  py: 1.2,
                  borderRadius: "24px",
                  boxShadow: showFavoritesOnly ? 2 : "none",
                }}
              >
                {showFavoritesOnly ? "Showing Favorites" : "Show Favorites"}
              </Button>
            </Box>
          </motion.div>

          {/* Loading, Error and Recipes */}
          {loading && (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <RecipeGrid
            recipes={displayedRecipes}
            onSelect={handleOpenModal}
            favorites={favorites}
            onToggleFavorite={handleFavoriteToggle}
          />

          {/* Recipe Modal */}
          <Dialog
            open={Boolean(selectedRecipe)}
            onClose={handleCloseModal}
            maxWidth="md"
            fullWidth
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: 3,
                padding: 2,
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                textAlign: "center",
                pb: 0,
              }}
            >
              {selectedRecipe?.title}
            </DialogTitle>

            <DialogContent dividers sx={{ maxHeight: "75vh", overflowY: "auto" }}>
              {modalLoading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress />
                </Box>
              ) : recipeDetails ? (
                <>
                  <Box
                    component="img"
                    src={recipeDetails.image}
                    alt={recipeDetails.title}
                    sx={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 2,
                      mb: 3,
                      boxShadow: 1,
                    }}
                  />

                  <Typography variant="h6" gutterBottom>
                    Ready in:{" "}
                    <Typography component="span" fontWeight="bold">
                      {recipeDetails.readyInMinutes} minutes
                    </Typography>
                  </Typography>

                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    Ingredients:
                  </Typography>
                  <List dense>
                    {recipeDetails.extendedIngredients.map((ing) => (
                      <ListItem key={ing.id} disablePadding>
                        <ListItemText primary={`• ${ing.original}`} />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    Instructions:
                  </Typography>
                  <DialogContentText component="div" sx={{ lineHeight: 1.6 }}>
                    {recipeDetails.instructions ? (
                      <Box
                        dangerouslySetInnerHTML={{
                          __html: recipeDetails.instructions,
                        }}
                      />
                    ) : (
                      <Typography>No instructions available.</Typography>
                    )}
                  </DialogContentText>
                </>
              ) : (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Failed to load recipe details.
                </Alert>
              )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                sx={{
                  borderRadius: "20px",
                  px: 4,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;

import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

const RecipeGrid = ({ recipes, onSelect, favorites, onToggleFavorite }) => {
  return (
    <Grid container spacing={3} sx={{ mt: 3 }}>
      {recipes.map((recipe) => {
        const isFavorited = favorites.some((fav) => fav.id === recipe.id);
        return (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card
              sx={{
                cursor: "pointer",
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                onClick={() => onSelect(recipe)}
                sx={{
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={recipe.image}
                  alt={recipe.title}
                  sx={{
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>

              <CardContent sx={{ pt: 1, pb: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minHeight: "3.2em",
                  }}
                >
                  {recipe.title}
                </Typography>

                <IconButton
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,1)",
                    },
                  }}
                  onClick={() => onToggleFavorite(recipe)}
                >
                  {isFavorited ? (
                    <Favorite sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorder sx={{ color: "#555" }} />
                  )}
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default RecipeGrid;

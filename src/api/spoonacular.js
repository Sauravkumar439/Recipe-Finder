import axios from "axios";

const BASE_URL = "https://api.spoonacular.com";
const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

export const fetchRecipes = async (query) => {
  const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
    params: {
      apiKey: API_KEY,
      query,
      number: 12,
    },
  });
  return response.data.results;
};

// ✅ New function to get detailed info
export const fetchRecipeDetails = async (id) => {
  const response = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
    params: {
      apiKey: API_KEY,
    },
  });
  return response.data;
};

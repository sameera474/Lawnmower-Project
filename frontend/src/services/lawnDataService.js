import axios from "axios";

export const getLawnData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/lawn-data");
    return response.data;
  } catch (error) {
    console.error("Error fetching lawn data:", error);
    return [];
  }
};

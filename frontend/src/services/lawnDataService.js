import axios from "axios";

export const getLawnData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/lawn-data`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching lawn data:", error);
    return [];
  }
};

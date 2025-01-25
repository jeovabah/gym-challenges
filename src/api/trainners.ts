import { apiGymGreen } from "./apiGymGreen";

export const getTrainners = async () => {
  const response = await apiGymGreen.get("/trainners");
  return response?.data;
};

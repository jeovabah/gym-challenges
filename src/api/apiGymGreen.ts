import axios from "axios";

export const apiGymGreen = axios.create({
  baseURL: "https://apigym-production.up.railway.app/",
});

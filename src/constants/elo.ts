import bronze from "../../assets/elos/bronze-no-bg.png";
import silver from "../../assets/elos/prata-no-bg.png";
import gold from "../../assets/elos/ouro-no-bg.png";
import diamond from "../../assets/elos/diamante-no-bg.png";

export const ELOS = {
  BRONZE: "60245da3-0a4c-42ea-ba13-f962494c648e",
  PRATA: "931e3c1e-f976-433d-ae16-03729a278695",
  OURO: "aeca5334-7a9a-412e-b66d-8631aeab8faa",
  DIAMANTE: "72ec0cb9-d5c7-4395-9a30-da0e6624d152",
};

export const ELOS_NAME = {
  [ELOS.BRONZE]: "Bronze",
  [ELOS.PRATA]: "Prata",
  [ELOS.OURO]: "Ouro",
  [ELOS.DIAMANTE]: "Diamante",
};

export const ELOS_IMAGE = {
  [ELOS.BRONZE]: bronze,
  [ELOS.PRATA]: silver,
  [ELOS.OURO]: gold,
  [ELOS.DIAMANTE]: diamond,
};

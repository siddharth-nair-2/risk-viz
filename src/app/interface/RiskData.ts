export interface RiskData {
  id: number;
  assetName: string;
  Lat: number;
  Long: number;
  businessCategory: string;
  riskRating: number;
  riskFactors: Record<RiskFactor, number>;
  Year: string;
}

type RiskFactor =
  | "Volcano"
  | "Wildfire"
  | "Extreme heat"
  | "Hurricane"
  | "Earthquake"
  | "Sea level rise"
  | "Tornado"
  | "Flooding"
  | "Extreme cold"
  | "Drought";


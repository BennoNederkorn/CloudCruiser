export interface SixtVehicle {
  id: string;
  brand: string;
  model: string;
  images: string[];
  groupType: string;
  attributes: { title: string; value: string }[];
}
export interface SixtDeal {
  vehicle: SixtVehicle;
  dealInfo: string;
  pricing: { displayPrice: { amount: number } };
}
export interface ProtectionPackage {
  id: string;
  name: string;
  price: { displayPrice: { amount: number } };
}
export interface Addon {
  id: number;
  name: string;
  options: { chargeDetail: { title: string }; additionalInfo: { price: { displayPrice: { amount: number } } } }[];
}
import { SixtDeal, ProtectionPackage, Addon } from "../types/sixt-api";

export const getAvailableVehicles = async (): Promise<{ deals: SixtDeal[] }> => {
  return {
    deals: [
      {
        vehicle: {
          id: "v1", brand: "BMW", model: "X5", groupType: "SUV",
          images: ["https://vehicle-pictures-prod.orange.sixt.com/142547/ffffff/18_1.png"], // Placeholder
          attributes: [{ title: "Transmission", value: "Automatic" }]
        },
        pricing: { displayPrice: { amount: 20.50 } },
        dealInfo: "DISCOUNT"
      }
    ]
  };
};

export const getProtections = async (): Promise<{ protectionPackages: ProtectionPackage[] }> => {
  return {
    protectionPackages: [
      { id: "p1", name: "Peace of Mind", price: { displayPrice: { amount: 15.00 } } },
      { id: "p2", name: "Tire & Glass", price: { displayPrice: { amount: 5.00 } } }
    ]
  };
};

export const getAddons = async (): Promise<{ addons: Addon[] }> => {
  return {
    addons: [
      {
        id: 1, name: "Extras",
        options: [{ chargeDetail: { title: "GPS" }, additionalInfo: { price: { displayPrice: { amount: 8.00 } } } }]
      }
    ]
  };
};
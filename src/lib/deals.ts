export interface Deal {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    modelAnnex: string;
    images: string[];
    bagsCount: number;
    passengersCount: number;
    attributes: {
      key: string;
      title: string;
      value: string;
    }[];
    upsellReasons: {
      title: string;
      description: string;
    }[];
  };
  pricing: {
    displayPrice: {
      currency: string;
      amount: number;
      prefix: string;
      suffix: string;
    };
    totalPrice: {
      currency: string;
      amount: number;
    };
  };
}

export interface FormattedCar {
  id: string;
  name: string;
  model: string;
  imageUrl: string;
  imageBase64: string;
  pricePerDay: number;
  currency: string;
  features: string[];
  specs: {
    mileage: string;
    seats: number;
    luggage: number;
  };
}

export interface CarDataContextType {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  getFormattedCars: () => FormattedCar[];
}

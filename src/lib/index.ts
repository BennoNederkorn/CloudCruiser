export interface ApiVehicle {
  id: string;
  name: string;
  model: string;
  make: string;
  group: string;
  series: string;
  vehicleType: string;
  color: string;
  fuelType: string;
  fuelLevel: number;
  transmission: string;
  licensePlate: string;
  innerCleanliness: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  price: {
    amount: number;
    currency: string;
  };
  mileage: number;
  seats: number;
  doors: number;
  luggage: number;
  features: string[];
}

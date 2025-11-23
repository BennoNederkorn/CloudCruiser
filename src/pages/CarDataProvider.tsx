import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Deal, FormattedCar, CarDataContextType } from "@/types/deals";

const CarDataContext = createContext<CarDataContextType | undefined>(undefined);

export const CarDataProvider = ({ children }: { children: ReactNode }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarDeals = async () => {
      try {
        setLoading(true);
        const bookingResponse = await fetch(`/api/booking`, { method: "POST" });
        if (!bookingResponse.ok) throw new Error("Failed to create booking.");
        const bookingData = await bookingResponse.json();

        const vehiclesResponse = await fetch(`/api/booking/${bookingData.id}/vehicles`);
        if (!vehiclesResponse.ok) throw new Error("Failed to fetch vehicles.");
        const responseData = await vehiclesResponse.json();

        if (responseData.deals && responseData.deals.length > 0) {
          setDeals(responseData.deals); // Store the raw deals data
          console.log("vehicles data:", responseData)
        }
      } catch (e) {
        if (e instanceof Error) setError(e.message);
        else setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDeals();
  }, []);

  // This is the function you can call to get the formatted cars
  const getFormattedCars = (): FormattedCar[] => {
    return deals.map((deal) => {
      const apiCar = deal.vehicle;
      const apiPricing = deal.pricing;

      // If the brand is 'Volkswagen', use 'VW', otherwise use the original brand name.
      const displayBrandName = apiCar.brand.toLowerCase() === 'volkswagen' ? 'VW' : apiCar.brand;
      const displayCurrency = apiPricing.displayPrice.currency === 'USD' ? '$' : '€';

      return {
        id: apiCar.id,
        name: `${displayBrandName} ${apiCar.model}`,
        model: apiCar.modelAnnex,
        imageUrl: apiCar.images[0],
        pricePerDay: apiPricing.displayPrice.amount,
        currency: displayCurrency,
        features: [
          // Combine features from upsellReasons...
          ...apiCar.upsellReasons.map(reason => reason.title),
          // ...and from specific attributes
          ...apiCar.attributes
            .filter(attr => [
              "P100_VEHICLE_UPSELL_ATTRIBUTE_KEYLESS_IGNITION",
              "P100_VEHICLE_UPSELL_ATTRIBUTE_NAVIGATION",
              "P100_VEHICLE_UPSELL_ATTRIBUTE_NEW_VEHICLE",
              "P100_VEHICLE_ATTRIBUTE_MILEAGE",
              "P100_VEHICLE_ATTRIBUTE_BOOT_CAPACITY",
              "P100_VEHICLE_UPSELL_ATTRIBUTE_BLUETOOTH"
            ].includes(attr.key))
            .map(attr => attr.title)
        ].slice(0, 4), // Take the first 4 features from the combined list

        specs: {
          mileage: apiCar.attributes.find(attr => attr.key.includes("MILEAGE"))?.value || "N/A",
          seats: parseInt(apiCar.attributes.find(attr => attr.key === "P100_VEHICLE_ATTRIBUTE_SEATS")?.value || apiCar.passengersCount.toString(), 10),
          luggage: apiCar.bagsCount,
        },
      };
    });
  };

  const value = { deals, loading, error, getFormattedCars };

  return (
    <CarDataContext.Provider value={value}>
      {children}
    </CarDataContext.Provider>
  );
};

export const useCarData = () => {
  const context = useContext(CarDataContext);
  if (context === undefined) {
    throw new Error("useCarData must be used within a CarDataProvider");
  }
  return context;
};

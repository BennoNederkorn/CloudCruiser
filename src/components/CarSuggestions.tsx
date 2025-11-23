import { useEffect, useState } from "react";
import CarSuggestionCard from "./CarSuggestionCard";
import { ApiVehicle } from "@/types";

const CarSuggestions = () => {
  const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Create a booking to get a booking ID
        const bookingResponse = await fetch(`/api/booking`, {
          method: "POST",
        });

        if (!bookingResponse.ok) {
          throw new Error("Failed to create booking.");
        }

        const bookingData = await bookingResponse.json();
        const bookingId = bookingData.id;

        // Step 2: Fetch vehicles for the created booking
        const vehiclesResponse = await fetch(
          `/api/booking/${bookingId}/vehicles`
        );

        if (!vehiclesResponse.ok) {
          throw new Error("Failed to fetch vehicles.");
        }

        const vehicleData: ApiVehicle[] = await vehiclesResponse.json();
        setVehicles(vehicleData);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return <div>Loading car suggestions...</div>;
  }

  if (error) {
    return <div className="text-destructive">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {vehicles.map((vehicle) => (
        <CarSuggestionCard
          key={vehicle.id}
          car={{
            name: `${vehicle.make} ${vehicle.model}`,
            model: vehicle.series,
            imageUrl: vehicle.imageUrl,
            pricePerDay: vehicle.price.amount,
            features: vehicle.features,
            specs: {
              mileage: vehicle.mileage > 0 ? `${vehicle.mileage} km` : "Unlimited",
              seats: vehicle.seats,
              luggage: vehicle.luggage,
            },
          }}
          onUpgrade={() => setSelectedCarId(vehicle.id)}
          isSelected={selectedCarId === vehicle.id}
        />
      ))}
    </div>
  );
};

export default CarSuggestions;
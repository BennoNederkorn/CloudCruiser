import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CustomerHeader from "@/components/CustomerHeader";
import CurrentCarCard from "@/components/CurrentCarCard";
import CarSuggestionCard from "@/components/CarSuggestionCard";
import UpsellPrompt from "@/components/UpsellPrompt";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; 
import { ArrowRight, Check, Currency } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FormattedCar } from "@/lib/deals";
import { getUpsellsForUser } from "@/lib/Upsell"; 
import { generateProfileFromFiles } from "@/lib/ScrapeToOutputProfile";
import { generatePersonalizedUpsellsFromObject } from "@/lib/Upsell";

// Mock data - will be replaced with API calls
const defaultCustomer = {
  name: "Sarah Johnson",
  rentalId: "SXT-2025-4892",
  pickupDate: "Nov 22, 2025 - 14:00",
  returnDate: "Nov 27, 2025 - 14:00",
};

const currentCar = {
  name: "TOYOTA COROLLA",
  model: "SEDAN 2024",
  imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
  pricePerDay: 39.99,
  currency: "$",
};

const mockCars = [
  {
    id: "1",
    name: "BMW SERIES 3",
    model: "330i XDRIVE",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    imageBase64: "",
    pricePerDay: 14.58,
    currency: "$",
    features: [
      "Luxurious Comfort",
      "Experience elegance and unrivaled comfort.",
      "Smart Technology",
      "Drive innovation with seamless integration.",
    ],
    specs: {
      mileage: "<1k miles",
      seats: 5,
      luggage: 4,
    },
  },
  {
    id: "2",
    name: "MERCEDES C-CLASS",
    model: "C300 4MATIC",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    imageBase64: "",
    pricePerDay: 16.99,
    currency: "$",
    features: [
      "Premium Performance",
      "Power meets sophistication on every drive.",
      "Advanced Safety",
      "Cutting-edge systems for ultimate protection.",
    ],
    specs: {
      mileage: "<500 miles",
      seats: 5,
      luggage: 3,
    },
  },
  {
    id: "3",
    name: "AUDI A4",
    model: "QUATTRO PREMIUM",
    imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    imageBase64: "",
    pricePerDay: 15.75,
    currency: "$",
    features: [
      "Dynamic Design",
      "Sleek aesthetics with powerful handling.",
      "Tech-Forward",
      "Intuitive controls and connectivity.",
    ],
    specs: {
      mileage: "<2k miles",
      seats: 5,
      luggage: 4,
    },
  },
];

const mockUpsells = [
  {
    id: "1",
    title: "Premium Insurance Coverage",
    description: "Drive with peace of mind. Full coverage including theft, damage, and roadside assistance.",
    price: 12.99,
    currency: "$",
    icon: "🛡️",
  },
  {
    id: "2",
    title: "GPS Navigation System",
    description: "Never get lost. Premium GPS with real-time traffic updates and points of interest.",
    price: 8.99,
    currency: "$",
    icon: "🗺️",
  },
  {
    id: "3",
    title: "Additional Driver",
    description: "Share the driving. Add an additional driver to your rental agreement.",
    price: 15.00,
    currency: "$",
    icon: "👥",
  },
];

const RentalFlow = () => {
  const location = useLocation();
  // Receive cars from the loading page, fallback to mockCars if not provided
  const {customer, cars} = location.state || {customer: defaultCustomer, cars: mockCars};

  //const [allCars, setAllCars] = useState<FormattedCar[]>(() => {
    // Set the generated image for each car
   // return cars.map((car: FormattedCar) => ({ ...car, imageBase64: generatedImageBase64 }));
 // });

  console.log("RentalFlow received customer:", customer);
  
  const [upsells, setUpsells] = useState<any[] | null>(null);
  const [currentUpsellIndex, setCurrentUpsellIndex] = useState(0);
  const [acceptedUpsells, setAcceptedUpsells] = useState<string[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [hasUpgraded, setHasUpgraded] = useState(false);
  const [upgradedCar, setUpgradedCar] = useState<typeof mockCars[0] | null>(null);
  const [showCarousel, setShowCarousel] = useState(true);

  useEffect(() => {
    const fetchUpsells = async () => {
      console.log("RentalFlow received customer:", customer);
      let personalizedUpsells = null;

      if (customer.name === "Iulia Pasov") {
        const profile = await generateProfileFromFiles('/scrapeOutput/Iulia.txt', '/vehicles.json');
        console.log("profile: ", profile)
        console.log("Type of profile:", typeof profile);
        personalizedUpsells = await generatePersonalizedUpsellsFromObject(profile);
        console.log("personalizedUpsells: ", personalizedUpsells)
      } else if (customer.name === "Marcus Thorne") {
        personalizedUpsells = await generatePersonalizedUpsellsFromObject("/scrapeOutputs/MarcusThorne.json");
      } else if (customer.name === "Family Miller") {
        personalizedUpsells = await generatePersonalizedUpsellsFromObject("/scrapeOutputs/MillerFamily.json");
      } else {
        personalizedUpsells = mockUpsells;
      }
      setUpsells(personalizedUpsells);
    };

    fetchUpsells();
  }, [customer.name]); // Re-run the effect if the customer name changes

  const handleUpgrade = (car: typeof mockCars[0]) => {
    setHasUpgraded(true);
    setUpgradedCar(car);
    toast.success(`Upgraded to {car.currency}{car.name}!`);
  };

  const handleAccept = () => {
    if (!upsells) return;
    const currentUpsell = upsells[currentUpsellIndex];
    setAcceptedUpsells([...acceptedUpsells, currentUpsell.id]);
    toast.success(`${currentCar.currency}${currentUpsell.title} added to your rental`);
    moveToNext();
  };

  const handleDecline = () => {
    if (!upsells) return;
    const currentUpsell = upsells[currentUpsellIndex];
    toast(`${currentCar.currency}${currentUpsell.title} declined`);
    moveToNext();
  };

  const moveToNext = () => {
    if (upsells && currentUpsellIndex < upsells.length - 1) {
      setCurrentUpsellIndex(currentUpsellIndex + 1);
    } else {
      setShowCompletion(true);
    }
  };

  const calculateTotal = () => {
    let total = hasUpgraded && upgradedCar ? upgradedCar.pricePerDay + currentCar.pricePerDay : currentCar.pricePerDay;
    acceptedUpsells.forEach(id => {
      const upsell = upsells?.find(u => u.id === id);
      if (upsell) total += upsell.price;
    });
    return total.toFixed(2);
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-dark p-4 flex items-center justify-center">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-card rounded-xl p-8 shadow-elevated text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-orange rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">All Set!</h2>
            <p className="text-muted-foreground mb-6">
              Your rental is configured and ready to go.
            </p>
            <div className="bg-secondary rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-foreground">Base rental {currentCar.name}</span>
                    <span className="text-foreground">{currentCar.currency}{currentCar.pricePerDay}/day</span>
                </div>
              {hasUpgraded && upgradedCar && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-foreground">Car upgrade to {upgradedCar.name}</span>
                  <span className="text-foreground">+{upgradedCar.currency}{upgradedCar.pricePerDay}/day</span>
                </div>
              )}
              {acceptedUpsells.map(id => {
                const upsell = upsells?.find(u => u.id === id);
                return upsell ? (
                  <div key={id} className="flex justify-between items-center mb-2">
                    <span className="text-foreground">{upsell.title}</span>
                    <span className="text-foreground">+{upsell.currency}{upsell.price}/day</span>
                  </div>
                ) : null;
              })}
              <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-foreground">Total per day</span>
                <span className="text-2xl font-bold text-accent">{currentCar.currency}{calculateTotal()}</span>
              </div>
            </div>
            <Button
              className="w-full bg-gradient-orange hover:opacity-90 text-primary-foreground border-0 h-12 text-base font-semibold shadow-glow"
              onClick={() => toast.success("Proceeding to checkout...")}
            >
              Continue to Pickup
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-4 pb-8">
      <div className="max-w-md mx-auto space-y-4">
        <div className="pt-4">
          <CustomerHeader customer={customer} />
        </div>
        
        <div>
          <CurrentCarCard car={currentCar} onClick={() => setShowCarousel(false)} />
        </div>
        
        {showCarousel ? (
          <div className="relative">
            <Carousel 
              className="w-full"
              opts={{
                align: "center",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {cars.map((car) => (
                  <CarouselItem key={car.id} className="pl-2 md:pl-4 basis-[85%]">
                    <CarSuggestionCard 
                      car={car} 
                      onUpgrade={() => handleUpgrade(car)}
                      isSelected={upgradedCar?.id === car.id} 
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => setShowCarousel(true)}
              className="w-full bg-gradient-orange hover:opacity-90 text-primary-foreground border-0 h-12 text-base font-semibold shadow-glow"
            >
              See Recommended Options
            </Button>
          </div>
        )}
        
        {upsells && upsells.length > 0 && (
          <div>
            <UpsellPrompt
              upsell={upsells[currentUpsellIndex]}
              onAccept={handleAccept}
              onDecline={handleDecline}
              currentStep={currentUpsellIndex}
              totalSteps={upsells.length}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalFlow;

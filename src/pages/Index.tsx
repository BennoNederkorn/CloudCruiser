import { useState } from "react";
import CustomerHeader from "@/components/CustomerHeader";
import CarSuggestionCard from "@/components/CarSuggestionCard";
import UpsellPrompt from "@/components/UpsellPrompt";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowRight, Check } from "lucide-react";

// Mock data - will be replaced with API calls
const mockCustomer = {
  name: "Sarah Johnson",
  rentalId: "SXT-2025-4892",
  pickupDate: "Nov 22, 2025 - 14:00",
  returnDate: "Nov 27, 2025 - 14:00",
};

const mockCar = {
  name: "BMW SERIES 3",
  model: "330i XDRIVE",
  imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
  pricePerDay: 14.58,
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
};

const mockUpsells = [
  {
    id: "1",
    title: "Premium Insurance Coverage",
    description: "Drive with peace of mind. Full coverage including theft, damage, and roadside assistance.",
    price: 12.99,
    icon: "🛡️",
  },
  {
    id: "2",
    title: "GPS Navigation System",
    description: "Never get lost. Premium GPS with real-time traffic updates and points of interest.",
    price: 8.99,
    icon: "🗺️",
  },
  {
    id: "3",
    title: "Additional Driver",
    description: "Share the driving. Add an additional driver to your rental agreement.",
    price: 15.00,
    icon: "👥",
  },
];

const Index = () => {
  const [currentUpsellIndex, setCurrentUpsellIndex] = useState(0);
  const [acceptedUpsells, setAcceptedUpsells] = useState<string[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  const handleAccept = () => {
    const currentUpsell = mockUpsells[currentUpsellIndex];
    setAcceptedUpsells([...acceptedUpsells, currentUpsell.id]);
    toast.success(`${currentUpsell.title} added to your rental`);
    moveToNext();
  };

  const handleDecline = () => {
    const currentUpsell = mockUpsells[currentUpsellIndex];
    toast(`${currentUpsell.title} declined`);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentUpsellIndex < mockUpsells.length - 1) {
      setCurrentUpsellIndex(currentUpsellIndex + 1);
    } else {
      setShowCompletion(true);
    }
  };

  const calculateTotal = () => {
    let total = mockCar.pricePerDay;
    acceptedUpsells.forEach(id => {
      const upsell = mockUpsells.find(u => u.id === id);
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
                <span className="text-foreground">Base rental</span>
                <span className="text-foreground">${mockCar.pricePerDay}/day</span>
              </div>
              {acceptedUpsells.map(id => {
                const upsell = mockUpsells.find(u => u.id === id);
                return upsell ? (
                  <div key={id} className="flex justify-between items-center mb-2">
                    <span className="text-foreground">{upsell.title}</span>
                    <span className="text-foreground">+${upsell.price}/day</span>
                  </div>
                ) : null;
              })}
              <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-foreground">Total per day</span>
                <span className="text-2xl font-bold text-accent">${calculateTotal()}</span>
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
          <CustomerHeader customer={mockCustomer} />
        </div>
        
        <div>
          <CarSuggestionCard car={mockCar} />
        </div>
        
        <div>
          <UpsellPrompt
            upsell={mockUpsells[currentUpsellIndex]}
            onAccept={handleAccept}
            onDecline={handleDecline}
            currentStep={currentUpsellIndex}
            totalSteps={mockUpsells.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

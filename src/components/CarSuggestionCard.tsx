import { Button } from "@/components/ui/button";
import { Cog, Users, Luggage, ArrowRight, Check } from "lucide-react";

interface CarSuggestionCardProps {
  car: {
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
  };
  onUpgrade?: () => void;
  isSelected?: boolean;
}

const CarSuggestionCard = ({ car, onUpgrade, isSelected }: CarSuggestionCardProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-elevated">
      <div className="relative h-64 bg-gradient-to-br from-muted to-secondary">
        <img
          src={car.imageBase64}
          alt={car.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-foreground">{car.name}</h3>
        <p className="text-muted-foreground">{car.model}</p>
        
        <div className="flex gap-6 mt-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Cog className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground">Automatic</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground">{car.specs.seats}</span>
          </div>
          <div className="flex items-center gap-2">
            <Luggage className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground">{car.specs.luggage}</span>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          {car.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">+ {car.currency}{car.pricePerDay}</span>
          <span className="text-muted-foreground">/day</span>
        </div>

        {onUpgrade && (
          <Button
            onClick={onUpgrade}
            className={`w-full mt-4 border-0 h-12 text-base font-semibold transition-all ${
              isSelected 
                ? "bg-accent/20 text-accent border-2 border-accent shadow-[0_0_20px_rgba(var(--accent),0.3)]" 
                : "bg-gradient-orange hover:opacity-90 text-primary-foreground shadow-glow"
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Selected
              </>
            ) : (
              <>
                Upgrade to this Car
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CarSuggestionCard;
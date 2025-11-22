import { Car } from "lucide-react";

interface CurrentCarCardProps {
  car: {
    name: string;
    model: string;
    imageUrl: string;
  };
}

const CurrentCarCard = ({ car }: CurrentCarCardProps) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-elevated border border-border/50">
      <div className="flex items-center gap-3">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
          <img
            src={car.imageUrl}
            alt={car.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Car className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Your Current Selection</span>
          </div>
          <h3 className="text-sm font-bold text-foreground truncate">{car.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{car.model}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentCarCard;

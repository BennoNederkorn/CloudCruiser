import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface UpsellPromptProps {
  upsell: {
    id: string;
    title: string;
    description: string;
    price: number;
    icon: string;
  };
  onAccept: () => void;
  onDecline: () => void;
  currentStep: number;
  totalSteps: number;
}

const UpsellPrompt = ({ upsell, onAccept, onDecline, currentStep, totalSteps }: UpsellPromptProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card rounded-xl p-6 shadow-elevated border border-border/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-orange flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">{upsell.icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{upsell.title}</h3>
            <p className="text-muted-foreground mt-1">{upsell.description}</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-accent">+ us${upsell.price}</span>
              <span className="text-muted-foreground text-sm">/day</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3">
          <Button
            onClick={onAccept}
            className="flex-1 bg-gradient-orange hover:opacity-90 text-primary-foreground border-0 h-12 text-base font-semibold shadow-glow"
          >
            <Check className="w-5 h-5 mr-2" />
            Add to rental
          </Button>
          <Button
            onClick={onDecline}
            variant="outline"
            className="flex-1 border-border bg-secondary hover:bg-secondary/80 text-foreground h-12 text-base font-semibold"
          >
            <X className="w-5 h-5 mr-2" />
            No thanks
          </Button>
        </div>
        
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-8 bg-accent'
                  : idx < currentStep
                  ? 'w-1 bg-accent/50'
                  : 'w-1 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpsellPrompt;

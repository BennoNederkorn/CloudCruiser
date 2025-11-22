import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // [NEW] Import hook to read navigation state
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CarSuggestionCard from "@/components/CarSuggestionCard";
import UpsellPrompt from "@/components/UpsellPrompt";
import CustomerHeader from "@/components/CustomerHeader";

// Import Data & Hooks
import { sixt_personas } from "@/data/dummyPersonas";
import { useCloudCruiserPipeline } from "@/hooks/useCloudCruiserPipeline";
import { SixtPersona } from "@/types/persona";
import * as SixtApi from "@/api/mockSixtApi";
import { SixtVehicle, SixtDeal } from "@/types/sixt-api";

const Index = () => {
  // [NEW] 1. Read the passed Persona ID from the previous screen
  const location = useLocation();
  
  // Initialize state with the passed ID, or fallback to "persona_01"
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(
    location.state?.selectedPersonaId || "persona_01"
  );
  
  const [currentPersona, setCurrentPersona] = useState<SixtPersona>(
    sixt_personas[selectedPersonaId] || sixt_personas["persona_01"]
  );
  
  // 2. Data State
  const [upgradeDeal, setUpgradeDeal] = useState<SixtDeal | null>(null);
  const [apiLoading, setApiLoading] = useState(true);

  // 3. Fetch Data (Simulate Sixt Backend)
  useEffect(() => {
    const fetchData = async () => {
        setApiLoading(true);
        const data = await SixtApi.getAvailableVehicles();
        // Find the deal labeled "DISCOUNT" or take the 2nd one as upgrade
        const target = data.deals.find(d => d.dealInfo === "DISCOUNT") || data.deals[1] || data.deals[0];
        setUpgradeDeal(target);
        setApiLoading(false);
    };
    fetchData();
  }, []);

  // Update current persona if selection changes via Dropdown or Navigation
  useEffect(() => {
    if (sixt_personas[selectedPersonaId]) {
      setCurrentPersona(sixt_personas[selectedPersonaId]);
    }
  }, [selectedPersonaId]);

  // 4. Run AI Pipeline (Gemini)
  const { systemPrompt, backgroundUrl, prioritizedAddons, loading: aiLoading } = useCloudCruiserPipeline(
    currentPersona, 
    upgradeDeal?.vehicle || null
  );

  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const handleAccept = () => {
    setAccepted([...accepted, prioritizedAddons[step]]);
    toast.success("Added!");
    if (step < prioritizedAddons.length - 1) setStep(s => s + 1);
    else setFinished(true);
  };

  const handleDecline = () => {
    if (step < prioritizedAddons.length - 1) setStep(s => s + 1);
    else setFinished(true);
  };

  const isLoading = apiLoading || aiLoading;

  return (
    <div 
      className="min-h-screen p-4 transition-all duration-1000 ease-in-out bg-cover bg-center"
      style={{ 
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundColor: '#1a1a1a' 
      }}
    >
      <div className="fixed inset-0 bg-black/60 z-0 pointer-events-none backdrop-blur-[2px]" />
      
      <div className="relative z-10 max-w-md mx-auto space-y-4">
        
        {/* Header Control */}
        <div className="flex justify-between items-center bg-card/90 p-3 rounded-xl border border-white/10 backdrop-blur-md">
           <div className="flex items-center gap-2 text-white">
             <Sparkles className="w-4 h-4 text-orange-500" />
             <span className="font-bold">CloudCruiser</span>
           </div>
           <Select value={selectedPersonaId} onValueChange={(v) => {
             setSelectedPersonaId(v);
             setStep(0); 
             setFinished(false);
             setAccepted([]);
           }}>
             <SelectTrigger className="w-[180px] h-8 text-black bg-white/90"><SelectValue /></SelectTrigger>
             <SelectContent>
               <SelectItem value="persona_01">Max (Business/Stress)</SelectItem>
               <SelectItem value="persona_02">Sarah (Family/Safe)</SelectItem>
               <SelectItem value="persona_03">Lena (Gen Z/Vibe)</SelectItem>
               <SelectItem value="persona_04">Dr. Von Amsel (Luxury)</SelectItem>
               <SelectItem value="persona_05">Hans Müller (Senior/Safety)</SelectItem>
             </SelectContent>
           </Select>
        </div>

        {isLoading ? (
           <div className="h-[60vh] flex flex-col items-center justify-center text-white space-y-4">
             <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
             <p className="font-medium">Consulting Gemini AI...</p>
             <p className="text-xs text-white/50">Analyzing {currentPersona.core_profile.name}'s profile</p>
           </div>
        ) : finished ? (
            <div className="bg-card rounded-xl p-8 text-center border border-border/50 mt-10 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Ready to Drive!</h2>
                <div className="text-left bg-secondary/50 p-4 rounded-lg mb-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Summary</p>
                    <div className="text-sm mb-1 text-foreground">Vehicle: {upgradeDeal?.vehicle.brand} {upgradeDeal?.vehicle.model}</div>
                    {accepted.map(a => <div key={a} className="text-sm mb-1 text-green-600 font-medium">+ {a}</div>)}
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold" onClick={() => toast.success("Vehicle Unlocked!")}>Unlock in App</Button>
            </div>
        ) : (
           <>
             <CustomerHeader customer={{
               name: currentPersona.core_profile.name,
               rentalId: "SXT-GEMINI-01",
               pickupDate: "Today",
               returnDate: "In 3 days"
             }} />

             {upgradeDeal && <CarSuggestionCard car={{
                name: `${upgradeDeal.vehicle.brand} ${upgradeDeal.vehicle.model}`,
                model: upgradeDeal.vehicle.groupType,
                imageUrl: upgradeDeal.vehicle.images[0],
                pricePerDay: upgradeDeal.pricing.displayPrice.amount,
                features: upgradeDeal.vehicle.attributes.map(a => a.value),
                specs: { mileage: "Ultd", seats: 5, luggage: 2 }
             }} />}

             {prioritizedAddons[step] && (
               <UpsellPrompt 
                 upsell={{
                   id: `ai-${step}`,
                   title: prioritizedAddons[step],
                   description: `Recommended for ${currentPersona.current_trip_context.trip_purpose} trip to ${currentPersona.current_trip_context.destination}`,
                   price: 15,
                   icon: "✨"
                 }}
                 onAccept={handleAccept}
                 onDecline={handleDecline}
                 currentStep={step}
                 totalSteps={prioritizedAddons.length}
               />
             )}
             
             <div className="bg-black/80 p-3 rounded-lg text-[10px] text-green-400 font-mono mt-4 border border-green-900/50 shadow-lg">
               <span className="font-bold text-green-500">AI SYSTEM PROMPT:</span> {systemPrompt}
             </div>
           </>
        )}
      </div>
    </div>
  );
};

export default Index;
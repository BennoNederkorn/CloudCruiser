import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Sparkles, Check, ShieldCheck, ArrowLeft } from "lucide-react";
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
import { SixtVehicle, SixtDeal, ProtectionPackage, Addon } from "@/types/sixt-api";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Load Persona from Router State (passed from UserSelection)
  const selectedPersonaId = location.state?.selectedPersonaId || "persona_01";
  const [currentPersona, setCurrentPersona] = useState<SixtPersona>(sixt_personas[selectedPersonaId]);

  // 2. Data State
  const [upgradeDeal, setUpgradeDeal] = useState<SixtDeal | null>(null);
  const [protections, setProtections] = useState<ProtectionPackage[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [apiLoading, setApiLoading] = useState(true);

  // 3. Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
        setApiLoading(true);
        try {
          const data = await SixtApi.getAvailableVehicles();
          // Pick the deal with "DISCOUNT" or just the 2nd one as the "AI Upgrade"
          const target = data.deals.find(d => d.dealInfo === "DISCOUNT") || data.deals[1] || data.deals[0];
          setUpgradeDeal(target);
          
          const protData = await SixtApi.getProtections("");
          setProtections(protData.protectionPackages);
          
          const addonData = await SixtApi.getAddons("");
          setAddons(addonData.addons);
        } catch (e) {
          console.error(e);
        } finally {
          setApiLoading(false);
        }
    };
    fetchData();
  }, []);

  // 4. Run AI Pipeline
  const { systemPrompt, backgroundUrl, prioritizedAddons, loading: aiLoading } = useCloudCruiserPipeline(
    currentPersona, 
    upgradeDeal?.vehicle || null
  );

  // 5. Flow Logic
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState<{name: string, price: number}[]>([]);
  const [finished, setFinished] = useState(false);

  // Merge API data with AI priorities to create the "Flow"
  const activeUpsells = [
     ...protections.map(p => ({ name: p.name, price: p.price.displayPrice.amount, type: 'protection' })),
     ...addons.flatMap(a => a.options.map(o => ({ name: o.chargeDetail.title, price: o.additionalInfo.price.displayPrice.amount, type: 'addon' })))
  ].sort((a, b) => {
     // AI Sort: If item is in prioritized list, move to top
     const aPrio = prioritizedAddons.some(p => p.includes(a.name));
     const bPrio = prioritizedAddons.some(p => p.includes(b.name));
     return Number(bPrio) - Number(aPrio);
  });

  const handleAccept = () => {
    const current = activeUpsells[step];
    setAccepted([...accepted, { name: current.name, price: current.price }]);
    toast.success(`${current.name} added!`);
    moveNext();
  };

  const handleDecline = () => moveNext();

  const moveNext = () => {
    if (step < activeUpsells.length - 1) setStep(s => s + 1);
    else setFinished(true);
  };

  const isLoading = apiLoading || aiLoading;

  return (
    <div 
      className="min-h-screen p-4 transition-all duration-1000 ease-in-out bg-cover bg-center relative"
      style={{ 
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundColor: '#1a1a1a' 
      }}
    >
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/60 z-0 pointer-events-none backdrop-blur-[2px]" />
      
      {/* AI Status Indicator (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1 bg-black/50 rounded-full border border-white/10 backdrop-blur text-xs font-mono text-green-400">
        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
        {isLoading ? "AI Processing..." : "AI Online"}
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
         <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
         </Button>
      </div>

      <div className="relative z-10 max-w-md mx-auto space-y-4 mt-12">
        
        {isLoading ? (
           <div className="h-[60vh] flex flex-col items-center justify-center text-white space-y-4">
             <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
             <p className="font-medium text-lg">Consulting Gemini AI...</p>
             <div className="flex flex-col items-center text-sm text-white/50">
                <span>Analyzing Profile: {currentPersona.core_profile.name}</span>
                <span>Context: {currentPersona.current_trip_context.trip_purpose}</span>
             </div>
           </div>
        ) : finished ? (
            /* --- COMPLETION VIEW (PRICE OVERVIEW) --- */
            <div className="bg-card rounded-xl p-8 text-center border border-border/50 mt-10 animate-in zoom-in-95 shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                    <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-white">Ready to Drive!</h2>
                <p className="text-muted-foreground mb-6">Your personalized rental is ready.</p>
                
                <div className="text-left bg-secondary/50 p-6 rounded-xl mb-6 border border-white/5">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                        <span className="text-white font-medium">{upgradeDeal?.vehicle.brand} {upgradeDeal?.vehicle.model}</span>
                        <span className="text-white font-bold">${upgradeDeal?.pricing.displayPrice.amount}/day</span>
                    </div>
                    
                    {accepted.length > 0 ? (
                        <div className="space-y-2">
                            {accepted.map((a, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-green-400 flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> {a.name}</span>
                                    <span className="text-green-400">+${a.price}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-white/30 italic">No extras selected</p>
                    )}

                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-lg font-bold text-white">Total</span>
                        <span className="text-2xl font-bold text-orange-500">
                           ${( (upgradeDeal?.pricing.displayPrice.amount || 0) + accepted.reduce((sum, i) => sum + i.price, 0) ).toFixed(2)}
                        </span>
                    </div>
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 text-lg shadow-glow">
                    Unlock Vehicle via App
                </Button>
            </div>
        ) : (
           <>
             {/* Active Flow */}
             <CustomerHeader customer={{
               name: currentPersona.core_profile.name,
               rentalId: "SXT-GEMINI-01",
               pickupDate: "Today, 10:00",
               returnDate: "In 3 days"
             }} />

             {upgradeDeal && <CarSuggestionCard car={{
                name: `${upgradeDeal.vehicle.brand} ${upgradeDeal.vehicle.model}`,
                model: upgradeDeal.vehicle.groupType,
                imageUrl: upgradeDeal.vehicle.images[0],
                pricePerDay: upgradeDeal.pricing.displayPrice.amount,
                features: upgradeDeal.vehicle.attributes.map(a => a.value),
                specs: { mileage: "Unlimited", seats: 5, luggage: 2 }
             }} />}

             {activeUpsells[step] && (
               <UpsellPrompt 
                 upsell={{
                   id: `ai-${step}`,
                   title: activeUpsells[step].name,
                   description: `AI Recommendation: Perfect for your ${currentPersona.current_trip_context.trip_purpose} trip to ${currentPersona.current_trip_context.destination}`,
                   price: activeUpsells[step].price,
                   icon: "✨"
                 }}
                 onAccept={handleAccept}
                 onDecline={handleDecline}
                 currentStep={step}
                 totalSteps={activeUpsells.length}
               />
             )}
             
             {/* Debug Prompt - To prove AI is working */}
             <div className="bg-black/80 p-3 rounded-lg text-[10px] text-green-400 font-mono mt-4 border border-green-900/50 shadow-lg opacity-70 hover:opacity-100 transition-opacity">
               <span className="font-bold text-green-500 block mb-1">GEMINI SYSTEM PROMPT:</span> 
               {systemPrompt || "Initializing..."}
             </div>
           </>
        )}
      </div>
    </div>
  );
};

export default Index;
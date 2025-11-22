import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import CarSuggestionCard from "@/components/CarSuggestionCard";
import UpsellPrompt from "@/components/UpsellPrompt";
import CustomerHeader from "@/components/CustomerHeader";

// Import Data & Hooks
import { sixt_personas } from "@/data/dummyPersonas";
import { useCloudCruiserPipeline } from "@/hooks/useCloudCruiserPipeline";
import { SixtPersona } from "@/types/persona";
import * as SixtApi from "@/api/mockSixtApi";
import { SixtVehicle } from "@/types/sixt-api";

const Index = () => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("persona_01");
  const [currentPersona, setCurrentPersona] = useState<SixtPersona>(sixt_personas["persona_01"]);
  const [vehicle, setVehicle] = useState<SixtVehicle | null>(null);

  // Load Initial Car Data
  useEffect(() => {
    SixtApi.getAvailableVehicles().then(data => {
      if (data.deals.length > 0) setVehicle(data.deals[0].vehicle);
    });
  }, []);

  // Run AI Pipeline
  const { systemPrompt, backgroundUrl, prioritizedAddons, loading } = useCloudCruiserPipeline(currentPersona, vehicle);

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
             setCurrentPersona(sixt_personas[v]);
           }}>
             <SelectTrigger className="w-[140px] h-8 text-black bg-white/90">
                <SelectValue />
             </SelectTrigger>
             <SelectContent>
                <SelectItem value="persona_01">Max (Business/Stress)</SelectItem>
                <SelectItem value="persona_02">Sarah (Family/Safe)</SelectItem>
                <SelectItem value="persona_03">Lena (Gen Z/Vibe)</SelectItem>
                <SelectItem value="persona_04">Dr. Von Amsel (Luxury)</SelectItem>
                <SelectItem value="persona_05">Hans Müller (Senior/Safety)</SelectItem>
             </SelectContent>
           </Select>
        </div>

        {loading ? (
           <div className="h-[60vh] flex flex-col items-center justify-center text-white space-y-4">
             <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
             <p>Consulting Gemini AI...</p>
           </div>
        ) : (
           <>
             {/* Customer Header */}
             <CustomerHeader customer={{
               name: currentPersona.core_profile.name,
               rentalId: "SXT-GEMINI-01",
               pickupDate: "Today",
               returnDate: "In 3 days"
             }} />

             {/* Car Card (With dynamic background via parent) */}
             {vehicle && <CarSuggestionCard car={{
                name: `${vehicle.brand} ${vehicle.model}`,
                model: vehicle.groupType,
                imageUrl: vehicle.images[0],
                pricePerDay: 25,
                features: ["Auto", "GPS"],
                specs: { mileage: "Ultd", seats: 5, luggage: 2 }
             }} />}

             {/* Upsell Prompt (Prioritized by AI) */}
             {prioritizedAddons.length > 0 && (
               <UpsellPrompt 
                 upsell={{
                   id: "ai-1",
                   title: prioritizedAddons[0],
                   description: "Recommended for your trip to " + currentPersona.current_trip_context.destination,
                   price: 15,
                   icon: "✨"
                 }}
                 onAccept={() => toast.success("Added!")}
                 onDecline={() => {}}
                 currentStep={1}
                 totalSteps={3}
               />
             )}
             
             {/* Debug View */}
             <div className="bg-black/80 p-2 rounded text-[10px] text-green-400 font-mono mt-4">
               AI SYSTEM PROMPT: {systemPrompt}
             </div>
           </>
        )}
      </div>
    </div>
  );
};

export default Index;
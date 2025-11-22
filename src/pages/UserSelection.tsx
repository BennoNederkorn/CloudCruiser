import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Briefcase, Plane, Sparkles } from "lucide-react";
import { sixt_personas } from "../data/dummyPersonas"; // Import the shared data

const UserSelection = () => {
  const navigate = useNavigate();

  const handleUserSelect = (personaId: string) => {
    // Navigate to the AI page and pass the ID
    navigate("/rental", { state: { selectedPersonaId: personaId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 flex items-center justify-center">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wider uppercase">CloudCruiser AI</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">Who is driving today?</h1>
          <p className="text-gray-400 text-lg">Select a persona to generate a tailored AI rental experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(sixt_personas).map((persona) => (
            <Card
              key={persona.id}
              className="group relative overflow-hidden border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10"
              onClick={() => handleUserSelect(Object.keys(sixt_personas).find(key => sixt_personas[key].id === persona.id) || "persona_01")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/10 group-hover:border-orange-500/50 transition-colors">
                    {persona.current_trip_context.trip_purpose === "Business" ? (
                      <Briefcase className="w-6 h-6 text-white" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  {persona.sap_backend_data.loyalty_status === "Sixt Platinum" && (
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-black text-white border border-white/20">
                      PLATINUM
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{persona.core_profile.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{persona.core_profile.profession}</p>

                <div className="space-y-3 text-sm text-gray-300 bg-black/20 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <Plane className="w-3 h-3 text-orange-500" />
                    <span>{persona.current_trip_context.origin} → {persona.current_trip_context.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="truncate opacity-80">{persona.psychographics_for_ai.mood_prediction}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center text-orange-500 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  Start Rental Flow <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSelection;
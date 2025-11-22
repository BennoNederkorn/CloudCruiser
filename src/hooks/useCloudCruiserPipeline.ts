import { useState, useEffect } from 'react';
import { SixtPersona, PipelineResult } from '../types/persona';
import { SixtVehicle } from '../types/sixt-api';
import { analyzePersonaWithGemini, generateNanoBananaBackgroundWithCar, buildSystemPrompt } from '../services/aiServices';

export const useCloudCruiserPipeline = (persona: SixtPersona | null, vehicle: SixtVehicle | null) => {
  const [result, setResult] = useState<PipelineResult>({
    systemPrompt: "",
    backgroundUrl: "",
    prioritizedAddons: [],
    loading: false
  });

  useEffect(() => {
    if (!persona || !vehicle) return;

    const runPipeline = async () => {
      setResult(prev => ({ ...prev, loading: true }));
      
      try {
        // Parallel Execution for Speed
        const [analysis, bgUrl] = await Promise.all([
            analyzePersonaWithGemini(persona),
            generateNanoBananaBackgroundWithCar(persona, vehicle)
        ]);

        const systemPrompt = buildSystemPrompt(persona, analysis.addons, analysis.tone);

        setResult({
          systemPrompt,
          backgroundUrl: bgUrl,
          prioritizedAddons: analysis.addons,
          loading: false
        });
        
      } catch (error) {
        console.error("Pipeline Error:", error);
        setResult(prev => ({ ...prev, loading: false }));
      }
    };

    runPipeline();
  }, [persona?.id, vehicle?.id]);

  return result;
};
export interface SixtPersona {
  id: string;
  core_profile: {
    name: string;
    age: number;
    profession: string;
    nationality?: string;
    languages?: string[];
  };
  sap_backend_data: {
    loyalty_status: string;
    clv_score: string;
    risk_score: string;
    company_contract?: string | null;
    payment_method?: string;
    booking_history_pattern: string;
    avg_upsell_acceptance?: string;
    add_on_affinity: string[];
  };
  current_trip_context: {
    origin: string;
    destination: string;
    flight_number?: string | null;
    flight_status: string | null;
    weather_at_dest: string;
    companions?: number;
    companion_details?: string;
    trip_purpose: string;
    booked_class: string;
  };
  psychographics_for_ai: {
    mood_prediction: string;
    tone_preference: string;
    primary_need?: string;
    visual_vibe: string;
  };
}

export interface PipelineResult {
  systemPrompt: string;
  backgroundUrl: string;
  prioritizedAddons: string[];
  loading: boolean;
}
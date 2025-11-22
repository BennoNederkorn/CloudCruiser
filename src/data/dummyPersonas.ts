import { SixtPersona } from "../types/persona";

export const sixt_personas: Record<string, SixtPersona> = {
  "persona_01": {
    "id": "BUS_PWR_089",
    "core_profile": {
      "name": "Maximilian 'Max' Sterling",
      "age": 34,
      "profession": "Management Consultant",
      "nationality": "German",
      "languages": ["de", "en"]
    },
    "sap_backend_data": {
      "loyalty_status": "Sixt Platinum",
      "clv_score": "High",
      "risk_score": "Low",
      "company_contract": "Mckinsey & Company",
      "payment_method": "Corporate AMEX",
      "booking_history_pattern": "Airport pickups, returns within 48h, prefers Audi/BMW",
      "avg_upsell_acceptance": "High (if comfort related)",
      "add_on_affinity": ["Full Protection", "Diesel Option"]
    },
    "current_trip_context": {
      "origin": "LHR (London Heathrow)",
      "destination": "MUC (Munich)",
      "flight_number": "LH2473",
      "flight_status": "Delayed (+45 min)",
      "weather_at_dest": "Rain, 4°C",
      "companions": 0,
      "trip_purpose": "Business",
      "booked_class": "FDAR (BMW 3er or similar)"
    },
    "psychographics_for_ai": {
      "mood_prediction": "Stressed, impatient, tired.",
      "tone_preference": "Efficient, professional, solution-oriented. No chit-chat.",
      "primary_need": "Speed and convenience.",
      "visual_vibe": "Dark, sleek, rainy airport asphalt, glowing tail lights."
    }
  },

  "persona_02": {
    "id": "FAM_VAC_030",
    "core_profile": {
      "name": "Sarah & Tom Miller",
      "age": 39,
      "profession": "Teacher / Architect",
      "nationality": "UK",
      "languages": ["en"]
    },
    "sap_backend_data": {
      "loyalty_status": "Gold",
      "clv_score": "Medium",
      "risk_score": "Very Low",
      "company_contract": null,
      "payment_method": "Visa Debit",
      "booking_history_pattern": "Once a year, long duration (10+ days), diverse locations",
      "avg_upsell_acceptance": "Medium (safety/space driven)",
      "add_on_affinity": ["Child Seat", "Additional Driver"]
    },
    "current_trip_context": {
      "origin": "LGW (Gatwick)",
      "destination": "PMI (Mallorca)",
      "flight_number": "EZY8303",
      "flight_status": "On Time",
      "weather_at_dest": "Sunny, 28°C",
      "companions": 2,
      "companion_details": "Kids aged 4 and 7",
      "trip_purpose": "Leisure",
      "booked_class": "CDMR (Ford Focus or similar)"
    },
    "psychographics_for_ai": {
      "mood_prediction": "Excited but overwhelmed by logistics/luggage.",
      "tone_preference": "Warm, reassuring, safety-focused.",
      "primary_need": "Space and Safety.",
      "visual_vibe": "Bright, sunny coast, spacious interior, ice cream."
    }
  },

  "persona_03": {
    "id": "GEN_Z_VIBE",
    "core_profile": {
      "name": "Lena K.",
      "age": 24,
      "profession": "Social Media Manager",
      "nationality": "German",
      "languages": ["de", "en"]
    },
    "sap_backend_data": {
      "loyalty_status": "Express",
      "clv_score": "Growing",
      "risk_score": "Medium (Young Driver)",
      "company_contract": null,
      "payment_method": "Mastercard",
      "booking_history_pattern": "Weekend rentals, city trips",
      "avg_upsell_acceptance": "High (Impulse buyer if 'cool')",
      "add_on_affinity": ["Young Driver Fee", "Sound System"]
    },
    "current_trip_context": {
      "origin": "Berlin City",
      "destination": "Hamburg (Festival)",
      "flight_number": null,
      "flight_status": null,
      "weather_at_dest": "Sunny",
      "companions": 3,
      "trip_purpose": "Leisure/Party",
      "booked_class": "ECMR (Opel Corsa or similar)"
    },
    "psychographics_for_ai": {
      "mood_prediction": "Hype, looking for fun.",
      "tone_preference": "Casual, witty, 'Du'-form, using emojis.",
      "primary_need": "Experience and Esthetics (Instagrammable car).",
      "visual_vibe": "Neon lights, sunset drive, friends laughing."
    }
  },

  "persona_04": {
    "id": "LUX_STAT_007",
    "core_profile": {
      "name": "Dr. Richard Von Amsel",
      "age": 58,
      "profession": "CEO",
      "nationality": "Swiss",
      "languages": ["de", "fr"]
    },
    "sap_backend_data": {
      "loyalty_status": "Diamond",
      "clv_score": "Very High",
      "risk_score": "Low",
      "company_contract": null,
      "payment_method": "Amex Black",
      "booking_history_pattern": "Premium sedans only (S-Class, 7 Series)",
      "avg_upsell_acceptance": "Low (Already books top tier)",
      "add_on_affinity": ["0€ Deductible", "Concierge Service"]
    },
    "current_trip_context": {
      "origin": "ZRH",
      "destination": "MUC (Munich City)",
      "flight_number": "LX1100",
      "flight_status": "On Time",
      "weather_at_dest": "Cloudy",
      "companions": 1,
      "trip_purpose": "Leisure / Opera Visit",
      "booked_class": "LDAR (BMW 5 Series)"
    },
    "psychographics_for_ai": {
      "mood_prediction": "Relaxed, expecting perfection.",
      "tone_preference": "Formal, respectful, exclusive.",
      "primary_need": "Status and Comfort.",
      "visual_vibe": "Elegant, classical architecture, leather interior, champagne."
    }
  },

  "persona_05": {
    "id": "SEN_CAUTION",
    "core_profile": {
      "name": "Elfriede & Hans Müller",
      "age": 72,
      "profession": "Retired",
      "nationality": "German",
      "languages": ["de"]
    },
    "sap_backend_data": {
      "loyalty_status": "Gold (Legacy)",
      "clv_score": "Medium",
      "risk_score": "Medium (Age related)",
      "company_contract": null,
      "payment_method": "Visa",
      "booking_history_pattern": "Infrequent, always full insurance",
      "avg_upsell_acceptance": "High (Fear-based/Safety)",
      "add_on_affinity": ["Navigation", "Automatic Transmission guarantee"]
    },
    "current_trip_context": {
      "origin": "Train Station Munich",
      "destination": "Bavarian Forest",
      "flight_number": null,
      "flight_status": null,
      "weather_at_dest": "Snow forecast",
      "companions": 1,
      "trip_purpose": "Family Visit",
      "booked_class": "CLMR (VW Golf Manual)"
    },
    "psychographics_for_ai": {
      "mood_prediction": "Slightly anxious about driving a new car.",
      "tone_preference": "Slow, very clear, patient, reassuring.",
      "primary_need": "Simplicity and Security.",
      "visual_vibe": "Cozy winter landscape, warm cabin, clear road signs."
    }
  }
};
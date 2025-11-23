import { Upsells } from "@/lib/QnALists";
import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

interface UserPersonaContext {
  identity: {
    name: string;
    segment: string;
    brand_affinity: string[];
  };
  inferred_preferences: {
    vehicle_class_preference: string;
    transmission: string;
    activity_type: string;
    risk_awareness: string;
  };
  dynamic_flags: {
    is_dog_friendly: boolean;
    is_car_enthusiast: boolean;
    requires_winter_readiness: boolean;
  };
}

interface SmartRecommendationEngine {
  VehicleSelection: {
    hero_recommendation: {
      vehicle_id: string;
      model_name: string;
      category_type: string;
      marketing_highlight_title: string;
      display_price_difference: string;
      personalized_reasoning: Array<{
        icon: string;
        text: string;
      }>;
    };
    alternative_recommendations: Array<{
      vehicle_id: string;
      model_name: string;
      category_type: string;
      discount_label: string;
      display_price_difference: string;
      reason: string;
    }>;
  };
  SmartProtectionUpsell: {
    recommended_package_id: string;
    narrative_strategy: string;
    persuasive_copy: string;
    highlighted_features: string[];
  };
  SmartAddOns: {
    prioritized_items: Array<{
      id: string;
      display_name: string;
      reason: string;
      is_included_in_hero: boolean;
    }>;
  };
}

interface UserProfile {
  UserPersonaContext: UserPersonaContext;
  SmartRecommendationEngine: SmartRecommendationEngine;
}

interface PersonalizedUpsell {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  icon: string;
}

export async function generatePersonalizedUpsells(
  userProfile: UserProfile
): Promise<PersonalizedUpsell[]> {
  try {
    const systemInstruction = `Based on the comprehensive user profile, select the 3 most relevant upsells from the available options and personalize their descriptions to match the user's specific persona and preferences.

Instructions:
1. Select the 3 most relevant upsells based on:
   - User's risk awareness level
   - Their activity type and preferences
   - Dynamic flags (dog-friendly, car enthusiast, winter needs)
   - Smart recommendation engine suggestions
   - Their segment and brand affinity

2. Keep the original id, title, price, currency, and icon unchanged
3. Personalize ONLY the description to directly address their specific needs, preferences, and concerns
4. Use the user's name and reference their specific situation when appropriate
5. Match the narrative strategy from SmartProtectionUpsell if selecting protection items

Please respond with a JSON array of exactly 3 upsell objects:
[
  {
    "id": "original_id",
    "title": "original_title", 
    "description": "highly personalized description that speaks to the user's specific needs, preferences, and situation",
    "price": original_price,
    "currency": "original_currency",
    "icon": "original_icon"
  }
]

Make the descriptions feel like they were written specifically for this individual user, referencing their preferences and addressing their likely concerns. Keep it 100 characters`;

    const userContent = `User Profile Analysis:
- Name: ${userProfile.UserPersonaContext.identity.name}
- Segment: ${userProfile.UserPersonaContext.identity.segment}
- Brand Affinity: ${userProfile.UserPersonaContext.identity.brand_affinity.join(', ')}
- Vehicle Preference: ${userProfile.UserPersonaContext.inferred_preferences.vehicle_class_preference}
- Activity Type: ${userProfile.UserPersonaContext.inferred_preferences.activity_type}
- Risk Awareness: ${userProfile.UserPersonaContext.inferred_preferences.risk_awareness}
- Dog Friendly: ${userProfile.UserPersonaContext.dynamic_flags.is_dog_friendly}
- Car Enthusiast: ${userProfile.UserPersonaContext.dynamic_flags.is_car_enthusiast}
- Winter Readiness: ${userProfile.UserPersonaContext.dynamic_flags.requires_winter_readiness}

Smart Recommendations Context:
- Recommended Protection: ${userProfile.SmartRecommendationEngine.SmartProtectionUpsell.recommended_package_id}
- Protection Strategy: ${userProfile.SmartRecommendationEngine.SmartProtectionUpsell.narrative_strategy}
- Prioritized Add-ons: ${userProfile.SmartRecommendationEngine.SmartAddOns.prioritized_items.map(item => item.display_name).join(', ')}

Available Upsells:
${JSON.stringify(Upsells, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userContent,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    
    const responseText = response.text;
    
    // Clean up the response to extract JSON
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const personalizedUpsells = JSON.parse(jsonMatch[0]);
      
      // Validate that we have exactly 3 upsells
      if (Array.isArray(personalizedUpsells) && personalizedUpsells.length === 3) {
        return personalizedUpsells;
      }
    }
    
    throw new Error("Invalid response format from AI");
    
  } catch (error) {
    console.error("Error generating personalized upsells:", error);
    
    // Fallback to first 3 upsells with original descriptions
    return Upsells.slice(0, 3);
  }
}

// Function to load profile and generate upsells
export async function getUpsellsForUser(profilePath?: string): Promise<PersonalizedUpsell[]> {
  try {
    let userProfile: UserProfile;
    
    if (profilePath) {
      // Load profile from file
      const response = await fetch(profilePath);
      userProfile = await response.json();
    } else {
      // Use default profile for testing
      userProfile = {
        UserPersonaContext: {
          identity: {
            name: "Alex Johnson",
            segment: "Business Professional",
            brand_affinity: ["BMW", "Mercedes"]
          },
          inferred_preferences: {
            vehicle_class_preference: "Premium",
            transmission: "Automatic",
            activity_type: "Business Travel",
            risk_awareness: "High"
          },
          dynamic_flags: {
            is_dog_friendly: false,
            is_car_enthusiast: true,
            requires_winter_readiness: false
          }
        },
        SmartRecommendationEngine: {
          VehicleSelection: {
            hero_recommendation: {
              vehicle_id: "uuid-123",
              model_name: "BMW X5",
              category_type: "UPSELL",
              marketing_highlight_title: "Premium Business Class",
              display_price_difference: "+ $46.75/day",
              personalized_reasoning: [
                { icon: "star", text: "Perfect for business meetings" }
              ]
            },
            alternative_recommendations: []
          },
          SmartProtectionUpsell: {
            recommended_package_id: "premium-protection",
            narrative_strategy: "Empathy_Based",
            persuasive_copy: "Protect your business reputation",
            highlighted_features: ["Full Coverage", "Zero Deductible"]
          },
          SmartAddOns: {
            prioritized_items: [
              {
                id: "gps",
                display_name: "GPS Navigation",
                reason: "Business efficiency",
                is_included_in_hero: false
              }
            ]
          }
        }
      };
    }
    
    return await generatePersonalizedUpsells(userProfile);
  } catch (error) {
    console.error("Error loading user profile:", error);
    return Upsells.slice(0, 3);
  }
}

export async function generatePersonalizedUpsellsFromObject(
  userProfile: UserProfile
): Promise<PersonalizedUpsell[]> {
  return await generatePersonalizedUpsells(userProfile);
}

/*example usage

// Mit JSON-Profil aus Datei
const upsells = await getUpsellsForUser('/profile.json');

// Mit Profil-Objekt direkt
const upsells = await generatePersonalizedUpsells(userProfileObject);

*/
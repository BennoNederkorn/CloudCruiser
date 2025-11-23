import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { generateNanoBananaImage } from "@/lib/gemini";
import { useCarData } from "@/lib/CarDataProvider";
import { base64ToBlob } from "@/lib/utils";

const LoadingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customer = location.state?.customer;
  const { loading: carsLoading, error: carsError, getFormattedCars } = useCarData();

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Get the formatted cars from the provider
        const formattedCars = getFormattedCars();

        // Example: Fetch car recommendations
        // const recommendations = await fetchCarRecommendations(customer);
        
        // Example: Call AI model for personalized suggestions
        // const aiSuggestions = await getAISuggestions(customer);
        console.log("Generating image with Gemini API...");

        // Call Gemini to generate the background image for all formatted cars
        const generatedImages = await Promise.all(formattedCars.map(async (car) => {
            const generatedImageBase64 = await generateNanoBananaImage(
                car.imageUrl, 
                { 
                    location: customer.location, 
                    time: customer.pickupDate, 
                    role: customer.role, 
                    enviroment: customer.enviroment 
                }
            );
            // // Simulate loading time (remove this in production)
            // await new Promise(resolve => setTimeout(resolve, 2000));
            const blob = base64ToBlob(generatedImageBase64, "image/png");
            const shortUrl = URL.createObjectURL(blob);
            return shortUrl;
        }));

        // Attach generated images to corresponding cars
        formattedCars.forEach((car, index) => {
            car.imageBase64 = generatedImages[index];
        });


        // 2. Navigate to rental flow with all the data
        navigate("/rental", { 
          state: { 
            customer,
            //generatedImageBase64: `data:image/png;base64,${generatedImageBase64}`,
            // Pass the formatted cars to the next page
            cars: formattedCars,
          } 
        });
      } catch (error) {
        console.error("Error loading data:", error);
        // Handle error - maybe navigate back or show error message
      }
    };

    // 3. Wait for the CarDataProvider to finish loading before proceeding
    if (!carsLoading && customer) {
      if (carsError) {
        console.error("Error from CarDataProvider:", carsError);
        // Optionally, navigate with an error state or show a message
      }
      loadData();
    } else if (!customer) {
      navigate("/");
    }
  }, [customer, navigate, carsLoading, carsError, getFormattedCars]);

  return (
    <div className="min-h-screen bg-gradient-dark p-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-card rounded-xl p-6 shadow-elevated">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Preparing Your Experience</h2>
            <p className="text-muted-foreground">Loading personalized recommendations...</p>
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;

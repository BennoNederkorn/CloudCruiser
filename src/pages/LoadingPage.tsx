import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customer = location.state?.customer;

  useEffect(() => {
    // TODO: Add your API calls and AI model logic here
    const loadData = async () => {
      try {
        // Example: Fetch car recommendations
        // const recommendations = await fetchCarRecommendations(customer);
        
        // Example: Call AI model for personalized suggestions
        // const aiSuggestions = await getAISuggestions(customer);
        
        // Simulate loading time (remove this in production)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Navigate to rental flow with the customer data and any additional data
        navigate("/rental", { 
          state: { 
            customer,
            // Add any data fetched from APIs here
            // recommendations,
            // aiSuggestions,
          } 
        });
      } catch (error) {
        console.error("Error loading data:", error);
        // Handle error - maybe navigate back or show error message
      }
    };

    if (customer) {
      loadData();
    } else {
      // No customer data, redirect back to user selection
      navigate("/");
    }
  }, [customer, navigate]);

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

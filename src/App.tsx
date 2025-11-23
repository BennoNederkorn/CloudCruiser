import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CarDataProvider } from './pages/CarDataProvider';
import UserSelection from "./pages/UserSelection";
import LoadingPage from "./pages/LoadingPage";
import RentalFlow from "./pages/RentalFlow";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CarDataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UserSelection />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/rental" element={<RentalFlow />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CarDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

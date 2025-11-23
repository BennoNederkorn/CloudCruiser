import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, User } from "lucide-react";
import { generateNanoBananaImage } from "@/lib/gemini";

const mockUsers = [
  {
    name: "Iulia Pasov",
    rentalId: "SXT-2025-4892",
    pickupDate: "Dec 22, 2025 - 14:00",
    returnDate: "Dec 27, 2025 - 14:00",
    email: "iulia.pasov@gmail.com",
    location: "Munich, Germany",
    role: "customer",
    enviroment: "beach or shoreline",
  },
  {
    name: "Marcus Thorne",
    rentalId: "SXT-2025-4893",
    pickupDate: "Apr 23, 2025 - 10:00",
    returnDate: "Apr 28, 2025 - 10:00",
    email: "marcus.thorne@gmail.com",
    location: "New York, USA",
    role: "customer",
    enviroment: "urban city"
  },
  {
    name: "Family Miller",
    rentalId: "SXT-2025-4894",
    pickupDate: "Jum 24, 2025 - 16:00",
    returnDate: "Jum 29, 2025 - 16:00",
    email: "emma.miller@email.com",
    location: "medetarian see, Italy",
    role: "customer",
    enviroment: "olive trees or landscape"
  },
  {
    name: "James Wilson",
    rentalId: "SXT-2025-4895",
    pickupDate: "March 25, 2025 - 12:00",
    returnDate: "March 30, 2025 - 12:00",
    email: "james.wilson@email.com",
    location: "Marocco, rabat",
    role: "customer",
    enviroment: "desert"
  },
];

const UserSelection = () => {
  const navigate = useNavigate();

  const handleUserSelect = (user: typeof mockUsers[0]) => {
    navigate("/loading", { state: { customer: user } });
  };

  return (
    <div className="min-h-screen bg-gradient-dark p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Demo Mode</h1>
          <p className="text-muted-foreground">Select a customer to start the rental flow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockUsers.map((user) => (
            <Card
              key={user.rentalId}
              className="bg-card border-border/20 hover:border-primary/40 transition-all cursor-pointer p-6 group"
              onClick={() => handleUserSelect(user)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-orange flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{user.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{user.email}</p>
                  <p className="text-xs text-muted-foreground mb-2">Rental ID: {user.rentalId}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Pickup: {user.pickupDate}</p>
                    <p>Return: {user.returnDate}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary group-hover:text-accent transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSelection;

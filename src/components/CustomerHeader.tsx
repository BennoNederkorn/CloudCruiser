import { User } from "lucide-react";

interface CustomerHeaderProps {
  customer: {
    name: string;
    rentalId: string;
    pickupDate: string;
    returnDate: string;
  };
}

const CustomerHeader = ({ customer }: CustomerHeaderProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-elevated">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-orange flex items-center justify-center">
          <User className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground">{customer.name}</h2>
          <p className="text-sm text-muted-foreground">Rental ID: {customer.rentalId}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Pickup</p>
          <p className="text-sm font-medium text-foreground">{customer.pickupDate}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Return</p>
          <p className="text-sm font-medium text-foreground">{customer.returnDate}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerHeader;

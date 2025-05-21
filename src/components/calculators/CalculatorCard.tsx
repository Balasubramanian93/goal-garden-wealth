
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface CalculatorCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  calculator?: ReactNode;
  route?: string;
}

const CalculatorCard = ({ title, icon, description, route }: CalculatorCardProps) => {
  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="h-10 w-10 rounded-full bg-primary/10 p-2 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        {route && (
          <Link 
            to={route}
            className="flex items-center text-primary text-sm"
          >
            Calculate Now <ArrowRight size={16} className="ml-1" />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default CalculatorCard;

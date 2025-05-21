
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { ReactNode, useState } from "react";

interface CalculatorCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  calculator: ReactNode;
}

const CalculatorCard = ({ title, icon, description, calculator }: CalculatorCardProps) => {
  const [expanded, setExpanded] = useState(false);

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
        <button
          className="flex items-center text-primary text-sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Close" : "Calculate Now"} <ArrowRight size={16} className="ml-1" />
        </button>
      </CardFooter>
      
      {expanded && (
        <div className="px-6 pb-6">
          <div className="border-t pt-4">
            {calculator}
          </div>
        </div>
      )}
    </Card>
  );
};

export default CalculatorCard;

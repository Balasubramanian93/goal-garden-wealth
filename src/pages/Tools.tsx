
import MainLayout from "@/components/layout/MainLayout";
import { Calculator, TrendingUp, PiggyBank, Target, Flame } from "lucide-react";
import CalculatorCard from "@/components/calculators/CalculatorCard";

const Tools = () => {
  // Define the calculator tools
  const calculators = [
    { 
      title: "CAGR", 
      icon: <TrendingUp />, 
      description: "Figure out the compound annual growth rate in a flash", 
      route: "/calculators/cagr"
    },
    { 
      title: "NSC", 
      icon: <PiggyBank />, 
      description: "How much return does NSC give you? Find out!", 
      route: "/calculators/nsc"
    },
    { 
      title: "HRA", 
      icon: <Calculator />, 
      description: "The most accurate HRA calculator out there", 
      route: "/calculators/hra"
    },
    { 
      title: "MF", 
      icon: <TrendingUp />, 
      description: "Find out your mutual fund corpus on maturity!", 
      route: "/calculators/mf"
    },
    { 
      title: "SSY", 
      icon: <PiggyBank />, 
      description: "Should you invest in SSY? Check for yourself!", 
      route: "/calculators/ssy"
    },
    { 
      title: "IRR", 
      icon: <TrendingUp />, 
      description: "Calculate returns of investment with multiple cashflow", 
      route: "/calculators/irr"
    },
    { 
      title: "SIP", 
      icon: <PiggyBank />, 
      description: "How much can you save by starting an SIP? Find out!", 
      route: "/calculators/sip"
    },
    { 
      title: "Goal SIP", 
      icon: <Target />, 
      description: "Know the SIP amount required to achieve your goals", 
      route: "/calculators/goal-sip"
    },
    { 
      title: "FIRE", 
      icon: <Flame />, 
      description: "Know exactly how much you need to retire", 
      route: "/calculators/fire" 
    },
    { 
      title: "FD", 
      icon: <PiggyBank />, 
      description: "Calculate returns on fixed deposits", 
      route: "/calculators/fd"
    },
    { 
      title: "RD", 
      icon: <PiggyBank />, 
      description: "Calculate returns on recurring deposits", 
      route: "/calculators/rd"
    }
  ];
  
  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex items-center gap-2 mb-6">
          <Calculator size={32} className="text-primary" />
          <h1 className="text-3xl font-bold">Financial Calculators</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Use these powerful calculators to plan your investments, track your goals, and build your financial future.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc, index) => (
            <CalculatorCard
              key={index}
              title={calc.title}
              icon={calc.icon}
              description={calc.description}
              route={calc.route}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Tools;


import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Calculator, TrendingUp, PiggyBank, Target, Fire } from "lucide-react";
import CalculatorCard from "@/components/calculators/CalculatorCard";
import CAGRCalculator from "@/components/calculators/CAGRCalculator";
import FDCalculator from "@/components/calculators/FDCalculator";
import RDCalculator from "@/components/calculators/RDCalculator";
import SIPCalculator from "@/components/calculators/SIPCalculator";
import GoalSIPCalculator from "@/components/calculators/GoalSIPCalculator";
import MFCalculator from "@/components/calculators/MFCalculator";
import FIRECalculator from "@/components/calculators/FIRECalculator";
import NSCCalculator from "@/components/calculators/NSCCalculator";
import HRACalculator from "@/components/calculators/HRACalculator";
import SSYCalculator from "@/components/calculators/SSYCalculator";
import IRRCalculator from "@/components/calculators/IRRCalculator";

const Tools = () => {
  // Define the calculator tools
  const calculators = [
    { 
      title: "CAGR", 
      icon: <TrendingUp />, 
      description: "Figure out the compound annual growth rate in a flash", 
      calculator: <CAGRCalculator />
    },
    { 
      title: "NSC", 
      icon: <PiggyBank />, 
      description: "How much return does NSC give you? Find out!", 
      calculator: <NSCCalculator /> 
    },
    { 
      title: "HRA", 
      icon: <Calculator />, 
      description: "The most accurate HRA calculator out there", 
      calculator: <HRACalculator /> 
    },
    { 
      title: "MF", 
      icon: <TrendingUp />, 
      description: "Find out your mutual fund corpus on maturity!", 
      calculator: <MFCalculator /> 
    },
    { 
      title: "SSY", 
      icon: <PiggyBank />, 
      description: "Should you invest in SSY? Check for yourself!", 
      calculator: <SSYCalculator /> 
    },
    { 
      title: "IRR", 
      icon: <TrendingUp />, 
      description: "Calculate returns of investment with multiple cashflow", 
      calculator: <IRRCalculator /> 
    },
    { 
      title: "SIP", 
      icon: <PiggyBank />, 
      description: "How much can you save by starting an SIP? Find out!", 
      calculator: <SIPCalculator /> 
    },
    { 
      title: "Goal SIP", 
      icon: <Target />, 
      description: "Know the SIP amount required to achieve your goals", 
      calculator: <GoalSIPCalculator /> 
    },
    { 
      title: "FIRE", 
      icon: <Fire />, 
      description: "Know exactly how much you need to retire", 
      calculator: <FIRECalculator /> 
    },
    { 
      title: "FD", 
      icon: <PiggyBank />, 
      description: "Calculate returns on fixed deposits", 
      calculator: <FDCalculator /> 
    },
    { 
      title: "RD", 
      icon: <PiggyBank />, 
      description: "Calculate returns on recurring deposits", 
      calculator: <RDCalculator /> 
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
              calculator={calc.calculator}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Tools;


import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

type Calculator = {
  id: string;
  name: string;
  description: string;
  component: React.ReactNode;
};

const Tools = () => {
  const calculators: Calculator[] = [
    { 
      id: "fd", 
      name: "Fixed Deposit Calculator", 
      description: "Calculate returns on fixed deposits",
      component: <FDCalculator />
    },
    { 
      id: "rd", 
      name: "Recurring Deposit Calculator", 
      description: "Calculate returns on recurring deposits",
      component: <RDCalculator />
    },
    { 
      id: "cagr", 
      name: "CAGR Calculator", 
      description: "Calculate compound annual growth rate",
      component: <CAGRCalculator />
    },
    { 
      id: "mf", 
      name: "Mutual Fund Returns", 
      description: "Calculate potential returns on mutual fund investments",
      component: <MFCalculator />
    },
    { 
      id: "sip", 
      name: "SIP Calculator", 
      description: "Calculate returns on systematic investment plans",
      component: <SIPCalculator />
    },
    { 
      id: "goal-sip", 
      name: "Goal SIP Calculator", 
      description: "Calculate SIP needed to reach a financial goal",
      component: <GoalSIPCalculator />
    },
    { 
      id: "fire", 
      name: "FIRE Calculator", 
      description: "Financial Independence, Retire Early calculator",
      component: <FIRECalculator />
    }
  ];

  const [activeTab, setActiveTab] = useState(calculators[0].id);

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex items-center gap-2 mb-6">
          <Calculator size={32} className="text-primary" />
          <h1 className="text-3xl font-bold">Financial Tools</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Calculate Your Financial Future</CardTitle>
            <CardDescription>
              Use these calculators to help plan your investments and financial goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {calculators.map((calc) => (
                  <TabsTrigger key={calc.id} value={calc.id} className="whitespace-nowrap">
                    {calc.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {calculators.map((calc) => (
                <TabsContent key={calc.id} value={calc.id}>
                  {calc.component}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

// Calculator component implementations
const FDCalculator = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Fixed Deposit Calculator</h3>
      <p>Calculate returns on your fixed deposit investment.</p>
      {/* Implement FD calculator form here */}
    </div>
  );
};

const RDCalculator = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Recurring Deposit Calculator</h3>
      <p>Calculate returns on your recurring deposit investment.</p>
      {/* Implement RD calculator form here */}
    </div>
  );
};

const CAGRCalculator = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">CAGR Calculator</h3>
      <p>Calculate the compound annual growth rate of your investment.</p>
      {/* Implement CAGR calculator form here */}
    </div>
  );
};

const MFCalculator = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Mutual Fund Returns Calculator</h3>
      <p>Calculate potential returns on mutual fund investments.</p>
      {/* Implement MF calculator form here */}
    </div>
  );
};

const SIPCalculator = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">SIP Calculator</h3>
      <p>Calculate returns on systematic investment plans.</p>
      {/* Implement SIP calculator form here */}
    </div>
  );
};

const GoalSIPCalculator = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Goal SIP Calculator</h3>
      <p>Calculate the SIP amount needed to reach your financial goal.</p>
      {/* Implement Goal SIP calculator form here */}
    </div>
  );
};

const FIRECalculator = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">FIRE Calculator</h3>
      <p>Calculate when you can achieve financial independence and retire early.</p>
      {/* Implement FIRE calculator form here */}
    </div>
  );
};

export default Tools;

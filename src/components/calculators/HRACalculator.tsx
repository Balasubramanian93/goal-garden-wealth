
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toggle } from "@/components/ui/toggle";

const HRACalculator = () => {
  const [basicSalary, setBasicSalary] = useState<number | ''>('');
  const [hraReceived, setHraReceived] = useState<number | ''>('');
  const [rentPaid, setRentPaid] = useState<number | ''>('');
  const [metroCity, setMetroCity] = useState<boolean>(true);
  const [result, setResult] = useState<{ exemptedHRA: number, taxableHRA: number } | null>(null);

  const calculateHRA = () => {
    if (!basicSalary || !hraReceived || !rentPaid) {
      toast.error("Please fill all required fields");
      return;
    }

    // HRA exemption is minimum of following 3:
    // 1. Actual HRA received
    // 2. 50% of Basic (for metro cities) or 40% (for non-metro)
    // 3. Rent paid - 10% of basic salary
    
    const actualHRA = Number(hraReceived);
    const basicPercent = metroCity ? 0.5 : 0.4;
    const percentOfBasic = Number(basicSalary) * basicPercent;
    const rentMinusBasic = Number(rentPaid) - (Number(basicSalary) * 0.1);
    
    // Get the minimum of these three
    const exemptedAmount = Math.min(
      actualHRA, 
      percentOfBasic, 
      Math.max(0, rentMinusBasic) // Ensure this is not negative
    );
    
    const taxableHRA = actualHRA - exemptedAmount;
    
    setResult({
      exemptedHRA: parseFloat(exemptedAmount.toFixed(2)),
      taxableHRA: parseFloat(taxableHRA.toFixed(2))
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="basic">Basic Salary (₹)</Label>
        <Input
          id="basic"
          type="number"
          placeholder="40000"
          value={basicSalary}
          onChange={(e) => setBasicSalary(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="hra">HRA Received (₹)</Label>
        <Input
          id="hra"
          type="number"
          placeholder="20000"
          value={hraReceived}
          onChange={(e) => setHraReceived(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rent">Rent Paid (₹)</Label>
        <Input
          id="rent"
          type="number"
          placeholder="15000"
          value={rentPaid}
          onChange={(e) => setRentPaid(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Label>City Type:</Label>
        <Toggle 
          pressed={metroCity} 
          onPressedChange={setMetroCity}
          variant="outline"
        >
          {metroCity ? "Metro City (50%)" : "Non-Metro (40%)"}
        </Toggle>
      </div>

      <Button onClick={calculateHRA} className="w-full">Calculate HRA Exemption</Button>

      {result && (
        <div className="bg-muted p-4 rounded-md mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium">Exempted HRA</p>
              <p className="text-xl font-bold text-green-600">₹{result.exemptedHRA.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Taxable HRA</p>
              <p className="text-xl font-bold text-primary">₹{result.taxableHRA.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRACalculator;

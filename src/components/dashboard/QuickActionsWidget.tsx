
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calculator, Target, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActionsWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        <CardDescription>Fast access to common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button asChild variant="outline" className="h-20 flex-col gap-2">
            <Link to="/budget">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add Expense</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-20 flex-col gap-2">
            <Link to="/portfolio">
              <Upload className="h-5 w-5" />
              <span className="text-xs">Update Portfolio</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-20 flex-col gap-2">
            <Link to="/goals">
              <Target className="h-5 w-5" />
              <span className="text-xs">Update Goals</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-20 flex-col gap-2">
            <Link to="/tools">
              <Calculator className="h-5 w-5" />
              <span className="text-xs">Calculators</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsWidget;

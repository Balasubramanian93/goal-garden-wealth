
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { History, ChevronRight } from 'lucide-react';
import { BudgetPeriod } from '@/services/budgetService';

interface BudgetHistoryCardProps {
  uniqueYears: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
  displayedHistory: BudgetPeriod[];
  filteredHistory: BudgetPeriod[];
  onShowMore: () => void;
}

const BudgetHistoryCard = ({ 
  uniqueYears, 
  selectedYear, 
  onYearChange, 
  displayedHistory, 
  filteredHistory, 
  onShowMore 
}: BudgetHistoryCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Budget History</CardTitle>
        <History className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select onValueChange={onYearChange} defaultValue={selectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {uniqueYears.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CardDescription className="mb-4">View your budget and spending from previous periods.</CardDescription>
        <div className="space-y-3">
          {displayedHistory.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No budget history found.</p>
          ) : (
            displayedHistory.map((budget) => (
              <Link key={budget.id} to={`/budget/${budget.id}`} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-sm">{budget.period_name}</p>
                  <p className="text-xs text-muted-foreground">Exp: ${budget.total_expenses} | Inc: ${budget.total_income}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))
          )}
        </div>
        {filteredHistory.length > displayedHistory.length && (
          <Button variant="link" className="w-full mt-4" onClick={onShowMore}>
            Show More
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetHistoryCard;

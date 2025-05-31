
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Receipt, Save } from 'lucide-react';
import { transactionService } from '@/services/transactionService';
import { toast } from '@/hooks/use-toast';

interface TaxInfoManagerProps {
  expenseId: string;
  initialData?: {
    is_tax_deductible?: boolean;
    tax_category?: string;
    business_purpose?: string;
    subcategory?: string;
  };
  onUpdate?: () => void;
}

const TAX_CATEGORIES = [
  'Business Expenses',
  'Medical & Dental',
  'Charitable Donations',
  'Home Office',
  'Professional Development',
  'Travel & Transportation',
  'Office Supplies',
  'Software & Subscriptions',
  'Marketing & Advertising',
  'Other'
];

const TaxInfoManager: React.FC<TaxInfoManagerProps> = ({ expenseId, initialData, onUpdate }) => {
  const [isTaxDeductible, setIsTaxDeductible] = useState(initialData?.is_tax_deductible || false);
  const [taxCategory, setTaxCategory] = useState(initialData?.tax_category || '');
  const [businessPurpose, setBusinessPurpose] = useState(initialData?.business_purpose || '');
  const [subcategory, setSubcategory] = useState(initialData?.subcategory || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await transactionService.updateExpenseTaxInfo(expenseId, {
        is_tax_deductible: isTaxDeductible,
        tax_category: taxCategory || null,
        business_purpose: businessPurpose || null,
        subcategory: subcategory || null
      });

      onUpdate?.();
      toast({
        title: "Tax information updated",
        description: "Transaction tax details have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating tax info:', error);
      toast({
        title: "Error",
        description: "Failed to update tax information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Receipt className="h-4 w-4" />
          Tax Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tax Deductible Switch */}
        <div className="flex items-center justify-between">
          <Label htmlFor="tax-deductible">Tax Deductible</Label>
          <Switch
            id="tax-deductible"
            checked={isTaxDeductible}
            onCheckedChange={setIsTaxDeductible}
          />
        </div>

        {/* Tax Category */}
        {isTaxDeductible && (
          <>
            <div className="space-y-2">
              <Label>Tax Category</Label>
              <Select value={taxCategory} onValueChange={setTaxCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tax category" />
                </SelectTrigger>
                <SelectContent>
                  {TAX_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Business Purpose */}
            <div className="space-y-2">
              <Label>Business Purpose (Optional)</Label>
              <Input
                placeholder="Describe the business purpose..."
                value={businessPurpose}
                onChange={(e) => setBusinessPurpose(e.target.value)}
              />
            </div>

            {/* Subcategory */}
            <div className="space-y-2">
              <Label>Subcategory (Optional)</Label>
              <Input
                placeholder="Additional categorization..."
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Save Button */}
        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Tax Information'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaxInfoManager;

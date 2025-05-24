
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Receipt, FileText, Calendar, Store } from 'lucide-react';
import { receiptService, type Receipt as ReceiptType, type ReceiptItem } from '@/services/receiptService';

interface ReceiptDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  receiptId: string | null;
}

const ReceiptDetailsDialog = ({ isOpen, onOpenChange, receiptId }: ReceiptDetailsDialogProps) => {
  const [receipt, setReceipt] = useState<ReceiptType | null>(null);
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (receiptId && isOpen) {
      loadReceiptDetails();
    }
  }, [receiptId, isOpen]);

  const loadReceiptDetails = async () => {
    if (!receiptId) return;
    
    setIsLoading(true);
    try {
      const [receiptData, itemsData] = await Promise.all([
        receiptService.getReceipt(receiptId),
        receiptService.getReceiptItems(receiptId)
      ]);
      
      setReceipt(receiptData);
      setReceiptItems(itemsData);
    } catch (error) {
      console.error('Error loading receipt details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupItemsByCategory = (items: ReceiptItem[]) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ReceiptItem[]>);
  };

  const calculateCategoryTotal = (items: ReceiptItem[]) => {
    return items.reduce((total, item) => total + item.item_price, 0);
  };

  if (!receipt) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
            <DialogDescription>
              {isLoading ? 'Loading receipt details...' : 'Receipt not found'}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const receiptImageUrl = receiptService.getReceiptFileUrl(receipt.file_path);
  const groupedItems = groupItemsByCategory(receiptItems);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Receipt Details
          </DialogTitle>
          <DialogDescription>
            View detailed breakdown of your receipt items and categories
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receipt Image */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Receipt Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={receiptImageUrl} 
                  alt="Receipt" 
                  className="w-full max-h-96 object-contain border rounded-md"
                />
              </CardContent>
            </Card>

            {/* Receipt Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Receipt Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Store:</span>
                  <span>{receipt.store_name || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Date:</span>
                  <span>{receipt.receipt_date || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-semibold">${receipt.total_amount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Receipt Items by Category */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Items by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {receiptItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No detailed items available for this receipt
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Object.entries(groupedItems).map(([category, items]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm">{category}</h4>
                          <span className="font-medium text-sm">
                            ${calculateCategoryTotal(items).toFixed(2)}
                          </span>
                        </div>
                        <div className="space-y-1 pl-4">
                          {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">
                                {item.quantity > 1 && `${item.quantity}x `}{item.item_name}
                              </span>
                              <span>${item.item_price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDetailsDialog;

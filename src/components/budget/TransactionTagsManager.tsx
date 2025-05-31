import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Tag } from 'lucide-react';
import { transactionService, type TransactionTag } from '@/services/transactionService';
import { toast } from '@/hooks/use-toast';

interface TransactionTagsManagerProps {
  expenseId: string;
  onTagsChange?: () => void;
}

const TAG_TYPES = [
  { value: 'tax', label: 'Tax Related', color: 'bg-green-100 text-green-800' },
  { value: 'business', label: 'Business', color: 'bg-blue-100 text-blue-800' },
  { value: 'medical', label: 'Medical', color: 'bg-red-100 text-red-800' },
  { value: 'charity', label: 'Charity', color: 'bg-purple-100 text-purple-800' },
  { value: 'custom', label: 'Custom', color: 'bg-gray-100 text-gray-800' }
];

const TransactionTagsManager: React.FC<TransactionTagsManagerProps> = ({ expenseId, onTagsChange }) => {
  const [tags, setTags] = useState<TransactionTag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagType, setNewTagType] = useState('custom');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTags();
  }, [expenseId]);

  const loadTags = async () => {
    try {
      const loadedTags = await transactionService.getTransactionTags(expenseId);
      setTags(loadedTags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const addTag = async () => {
    if (!newTagName.trim()) return;

    setIsLoading(true);
    try {
      await transactionService.addTransactionTag(expenseId, newTagName.trim(), newTagType);
      setNewTagName('');
      setNewTagType('custom');
      await loadTags();
      onTagsChange?.();
      toast({
        title: "Tag added",
        description: "Transaction tag has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: "Error",
        description: "Failed to add tag. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeTag = async (tagId: string) => {
    try {
      await transactionService.removeTransactionTag(tagId);
      await loadTags();
      onTagsChange?.();
      toast({
        title: "Tag removed",
        description: "Transaction tag has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: "Error",
        description: "Failed to remove tag. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTagColor = (tagType: string) => {
    return TAG_TYPES.find(type => type.value === tagType)?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Tag className="h-4 w-4" />
          Transaction Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className={`${getTagColor(tag.tag_type)} flex items-center gap-1`}
              >
                {tag.tag_name}
                <button
                  onClick={() => removeTag(tag.id)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Add New Tag */}
        <div className="flex gap-2">
          <Input
            placeholder="Tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
            className="flex-1"
          />
          <Select value={newTagType} onValueChange={setNewTagType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAG_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addTag} disabled={isLoading || !newTagName.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTagsManager;

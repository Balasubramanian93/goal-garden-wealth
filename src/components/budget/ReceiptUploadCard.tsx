
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, XCircle } from 'lucide-react';

interface ReceiptUploadCardProps {
  selectedFiles: File[];
  uploadStatus: string;
  isAddingExpense: boolean;
  onUploadIconClick: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (file: File) => void;
  onUploadReceipts: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ReceiptUploadCard = ({
  selectedFiles,
  uploadStatus,
  isAddingExpense,
  onUploadIconClick,
  onFileChange,
  onRemoveFile,
  onUploadReceipts,
  fileInputRef
}: ReceiptUploadCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription className="text-lg font-semibold text-primary">Upload Receipts</CardDescription>
        <Upload className="h-8 w-8 text-muted-foreground cursor-pointer" onClick={onUploadIconClick} />
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">Click the upload icon above to add receipts.</CardDescription>
        <input 
          id="receipts" 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={onFileChange} 
          ref={fileInputRef}
          className="hidden"
        />

        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Selected Files:</p>
            <div className="grid grid-cols-2 gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center">
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-10 h-10 object-cover rounded-md mr-2" />
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="absolute top-1 right-1 h-5 w-5 p-0" onClick={() => onRemoveFile(file)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={onUploadReceipts} 
          disabled={selectedFiles.length === 0 || isAddingExpense || uploadStatus.startsWith('Processing')} 
          className="mt-4 w-full"
        >
          {isAddingExpense ? 'Adding Expenses...' : 'Upload and Log Expenses'}
        </Button>
        {uploadStatus && (
          <p className={`text-sm mt-2 text-center ${uploadStatus.includes('Successfully') ? 'text-green-600' : 'text-muted-foreground'}`}>
            {uploadStatus}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReceiptUploadCard;


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExportRequest {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  requested_at: string;
  completed_at?: string;
  export_data?: any;
}

const DataExportCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [latestRequest, setLatestRequest] = useState<ExportRequest | null>(null);

  const checkExistingRequest = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('data_export_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setLatestRequest(data);
      }
    } catch (error) {
      // No existing request found
    }
  };

  const requestDataExport = async () => {
    if (!user) return;

    setIsRequesting(true);
    try {
      // First, try to use edge function for comprehensive export
      let exportData;
      
      try {
        const { data: functionData, error: functionError } = await supabase.functions.invoke('export-user-data', {
          body: { userId: user.id }
        });
        
        if (functionError) throw functionError;
        exportData = functionData;
      } catch (functionError) {
        console.warn('Edge function failed, falling back to direct queries:', functionError);
        
        // Fallback: Direct queries to get user data
        const [
          profileData,
          expensesData,
          budgetData,
          goalsData,
          portfolioData,
          consentsData
        ] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('expenses').select('*').eq('user_id', user.id),
          supabase.from('budget_periods').select('*').eq('user_id', user.id),
          supabase.from('goals').select('*').eq('user_id', user.id),
          supabase.from('portfolio_assets').select('*').eq('user_id', user.id),
          supabase.from('user_consents').select('*').eq('user_id', user.id)
        ]);

        exportData = {
          profile: profileData.data,
          expenses: expensesData.data || [],
          budgets: budgetData.data || [],
          goals: goalsData.data || [],
          portfolio: portfolioData.data || [],
          consents: consentsData.data || [],
          exported_at: new Date().toISOString()
        };
      }

      // Store the export request
      const { data: request, error } = await supabase
        .from('data_export_requests')
        .insert({
          user_id: user.id,
          status: 'completed',
          export_data: exportData,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setLatestRequest(request);
      toast({
        title: "Data export ready",
        description: "Your data export has been prepared and is ready for download.",
      });
    } catch (error: any) {
      console.error('Error creating data export:', error);
      toast({
        title: "Export failed",
        description: error.message || "Failed to create data export. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const downloadData = async () => {
    if (!latestRequest?.export_data) return;

    setIsDownloading(true);
    try {
      const dataStr = JSON.stringify(latestRequest.export_data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `my-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your data export file has been downloaded.",
      });
    } catch (error: any) {
      console.error('Error downloading data:', error);
      toast({
        title: "Download failed",
        description: "Failed to download data export. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Check for existing request on mount
  useState(() => {
    checkExistingRequest();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Export
        </CardTitle>
        <CardDescription>
          Download a copy of all your personal data stored in our system.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Your export will include:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Profile information</li>
            <li>Budget and expense data</li>
            <li>Financial goals and investments</li>
            <li>Portfolio information</li>
            <li>Consent preferences</li>
          </ul>
        </div>

        {latestRequest && latestRequest.status === 'completed' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800">
              Data export ready (created {new Date(latestRequest.requested_at).toLocaleDateString()})
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={requestDataExport}
            disabled={isRequesting}
            variant="outline"
            className="flex-1"
          >
            {isRequesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              'Create New Export'
            )}
          </Button>
          
          {latestRequest?.export_data && (
            <Button 
              onClick={downloadData}
              disabled={isDownloading}
              className="flex-1"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExportCard;


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExportRequest {
  id: string;
  status: string;
  requested_at: string;
  completed_at: string | null;
  expires_at: string;
  export_data: any;
}

const DataExportCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const collectUserData = async () => {
    if (!user) return null;

    try {
      // Collect all user data from various tables
      const [profileData, goalsData, portfolioData, expensesData, receiptsData] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('goals').select('*').eq('user_id', user.id),
        supabase.from('portfolio_assets').select('*').eq('user_id', user.id),
        supabase.from('expenses').select('*').eq('user_id', user.id),
        supabase.from('receipts').select('*').eq('user_id', user.id)
      ]);

      return {
        user_profile: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in: user.last_sign_in_at,
          profile: profileData.data
        },
        financial_data: {
          goals: goalsData.data || [],
          portfolio_assets: portfolioData.data || [],
          expenses: expensesData.data || [],
          receipts: receiptsData.data || []
        },
        export_timestamp: new Date().toISOString(),
        export_format: 'JSON'
      };
    } catch (error) {
      console.error('Error collecting user data:', error);
      return null;
    }
  };

  const requestDataExport = async () => {
    if (!user) return;

    setIsRequesting(true);
    try {
      const userData = await collectUserData();
      
      if (!userData) {
        throw new Error('Failed to collect user data');
      }

      const { error } = await supabase
        .from('data_export_requests')
        .insert({
          user_id: user.id,
          status: 'completed',
          export_data: userData,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Export request created",
        description: "Your data export is ready for download.",
      });

      loadExportRequests();
    } catch (error: any) {
      console.error('Error requesting data export:', error);
      toast({
        title: "Export failed",
        description: error.message || "Failed to create export request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const loadExportRequests = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('data_export_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setExportRequests(data || []);
    } catch (error) {
      console.error('Error loading export requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExport = (exportData: any, requestId: string) => {
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wealthwise-data-export-${requestId.substring(0, 8)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Load export requests when component mounts
  React.useEffect(() => {
    loadExportRequests();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Export
        </CardTitle>
        <CardDescription>
          Download a copy of all your personal data stored in WealthWise. This includes your profile, financial goals, 
          portfolio information, and transaction history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Your data export will be available for download immediately and will expire after 7 days for security reasons.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={requestDataExport} 
          disabled={isRequesting}
          className="w-full"
        >
          {isRequesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing Export...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Request Data Export
            </>
          )}
        </Button>

        {exportRequests.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Recent Export Requests</h4>
            {exportRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(request.status)}
                  <div>
                    <p className="text-sm font-medium">
                      Export requested on {new Date(request.requested_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Status: {request.status} • Expires: {new Date(request.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {request.status === 'completed' && request.export_data && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadExport(request.export_data, request.id)}
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Download
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataExportCard;

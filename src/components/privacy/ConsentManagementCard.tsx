
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConsentRecord {
  id: string;
  consent_type: string;
  consented: boolean;
  consent_date: string;
}

const ConsentManagementCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const consentTypes = [
    {
      type: 'privacy_policy',
      label: 'Privacy Policy Agreement',
      description: 'Required for account operation',
      required: true
    },
    {
      type: 'data_processing',
      label: 'Data Processing',
      description: 'Required for service functionality',
      required: true
    },
    {
      type: 'marketing',
      label: 'Marketing Communications',
      description: 'Newsletter and promotional content',
      required: false
    }
  ];

  const loadConsents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', user.id)
        .order('consent_date', { ascending: false });

      if (error) throw error;

      // Get the latest consent for each type
      const latestConsents: ConsentRecord[] = [];
      const seenTypes = new Set();

      data?.forEach(consent => {
        if (!seenTypes.has(consent.consent_type)) {
          latestConsents.push(consent);
          seenTypes.add(consent.consent_type);
        }
      });

      setConsents(latestConsents);
    } catch (error) {
      console.error('Error loading consents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsent = async (consentType: string, consented: boolean) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_consents')
        .insert({
          user_id: user.id,
          consent_type: consentType,
          consented: consented,
          ip_address: 'unknown' // In production, capture actual IP
        });

      if (error) throw error;

      // Update local state
      setConsents(prev => {
        const filtered = prev.filter(c => c.consent_type !== consentType);
        return [...filtered, {
          id: Date.now().toString(),
          consent_type: consentType,
          consented: consented,
          consent_date: new Date().toISOString()
        }];
      });

      toast({
        title: "Consent updated",
        description: `Your ${consentType.replace('_', ' ')} preference has been updated.`,
      });
    } catch (error: any) {
      console.error('Error updating consent:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update consent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getConsentStatus = (consentType: string) => {
    const consent = consents.find(c => c.consent_type === consentType);
    return consent?.consented || false;
  };

  useEffect(() => {
    loadConsents();
  }, [user]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Consent Management
        </CardTitle>
        <CardDescription>
          Manage your data processing consents. You can update these preferences at any time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {consentTypes.map((consentInfo) => (
          <div key={consentInfo.type} className="flex items-start space-x-3">
            <Checkbox
              id={consentInfo.type}
              checked={getConsentStatus(consentInfo.type)}
              onCheckedChange={(checked) => 
                updateConsent(consentInfo.type, checked === true)
              }
              disabled={consentInfo.required || isSaving}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor={consentInfo.type}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {consentInfo.label}
                {consentInfo.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <p className="text-xs text-muted-foreground">
                {consentInfo.description}
                {consentInfo.required && " (Cannot be disabled)"}
              </p>
              {consents.find(c => c.consent_type === consentInfo.type) && (
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(
                    consents.find(c => c.consent_type === consentInfo.type)?.consent_date || ''
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConsentManagementCard;

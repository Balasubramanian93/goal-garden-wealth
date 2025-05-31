export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bill_reminders: {
        Row: {
          amount: number
          bill_name: string
          category: string
          created_at: string
          due_date: string
          frequency: string
          id: string
          is_paid: boolean
          is_recurring: boolean
          notes: string | null
          updated_at: string
          user_id: string
          vendor_name: string | null
        }
        Insert: {
          amount?: number
          bill_name: string
          category?: string
          created_at?: string
          due_date: string
          frequency?: string
          id?: string
          is_paid?: boolean
          is_recurring?: boolean
          notes?: string | null
          updated_at?: string
          user_id: string
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          bill_name?: string
          category?: string
          created_at?: string
          due_date?: string
          frequency?: string
          id?: string
          is_paid?: boolean
          is_recurring?: boolean
          notes?: string | null
          updated_at?: string
          user_id?: string
          vendor_name?: string | null
        }
        Relationships: []
      }
      budget_periods: {
        Row: {
          created_at: string
          id: string
          period: string
          period_name: string
          remaining_budget: number
          total_expenses: number
          total_income: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          period: string
          period_name: string
          remaining_budget?: number
          total_expenses?: number
          total_income?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          period?: string
          period_name?: string
          remaining_budget?: number
          total_expenses?: number
          total_income?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      category_spending: {
        Row: {
          amount: number
          category: string
          created_at: string
          expense_id: string | null
          id: string
          month_year: string
          receipt_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          expense_id?: string | null
          id?: string
          month_year: string
          receipt_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          expense_id?: string | null
          id?: string
          month_year?: string
          receipt_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_spending_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_spending_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_reminders: {
        Row: {
          created_at: string
          description: string | null
          due_date: string
          id: string
          priority: string
          reminder_type: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          priority?: string
          reminder_type?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          priority?: string
          reminder_type?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      data_export_requests: {
        Row: {
          completed_at: string | null
          expires_at: string
          export_data: Json | null
          id: string
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          expires_at?: string
          export_data?: Json | null
          id?: string
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          expires_at?: string
          export_data?: Json | null
          id?: string
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          business_purpose: string | null
          category: string
          created_at: string
          date: string
          id: string
          is_tax_deductible: boolean | null
          month_year: string
          receipt_id: string | null
          shop: string
          subcategory: string | null
          tax_category: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          business_purpose?: string | null
          category: string
          created_at?: string
          date: string
          id?: string
          is_tax_deductible?: boolean | null
          month_year: string
          receipt_id?: string | null
          shop: string
          subcategory?: string | null
          tax_category?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          business_purpose?: string | null
          category?: string
          created_at?: string
          date?: string
          id?: string
          is_tax_deductible?: boolean | null
          month_year?: string
          receipt_id?: string | null
          shop?: string
          subcategory?: string | null
          tax_category?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_metrics: {
        Row: {
          created_at: string
          credit_score: number | null
          debt_to_income_ratio: number | null
          emergency_fund_months: number | null
          financial_health_score: number | null
          id: string
          metric_date: string
          net_worth: number | null
          savings_rate: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credit_score?: number | null
          debt_to_income_ratio?: number | null
          emergency_fund_months?: number | null
          financial_health_score?: number | null
          id?: string
          metric_date?: string
          net_worth?: number | null
          savings_rate?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credit_score?: number | null
          debt_to_income_ratio?: number | null
          emergency_fund_months?: number | null
          financial_health_score?: number | null
          id?: string
          metric_date?: string
          net_worth?: number | null
          savings_rate?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goal_investments: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          goal_id: number
          id: number
          notes: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          goal_id: number
          id?: number
          notes?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          goal_id?: number
          id?: number
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goal_investments_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string
          current_amount: number
          expected_return: number
          icon_type: string
          id: number
          monthly_contribution: number
          name: string
          progress: number
          target_amount: number
          target_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          expected_return: number
          icon_type: string
          id?: number
          monthly_contribution: number
          name: string
          progress: number
          target_amount: number
          target_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          expected_return?: number
          icon_type?: string
          id?: number
          monthly_contribution?: number
          name?: string
          progress?: number
          target_amount?: number
          target_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investment_accounts: {
        Row: {
          account_name: string
          account_type: string
          cost_basis: number
          created_at: string
          current_value: number
          id: string
          last_updated: string
          provider_name: string | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_type: string
          cost_basis?: number
          created_at?: string
          current_value?: number
          id?: string
          last_updated?: string
          provider_name?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_type?: string
          cost_basis?: number
          created_at?: string
          current_value?: number
          id?: string
          last_updated?: string
          provider_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      portfolio_assets: {
        Row: {
          created_at: string
          gain: number
          id: number
          name: string
          type: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          gain: number
          id?: number
          name: string
          type: string
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          gain?: number
          id?: number
          name?: string
          type?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      receipt_items: {
        Row: {
          category: string
          created_at: string
          id: string
          item_name: string
          item_price: number
          quantity: number | null
          receipt_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          item_name: string
          item_price: number
          quantity?: number | null
          receipt_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          item_name?: string
          item_price?: number
          quantity?: number | null
          receipt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipt_items_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          id: string
          processed_at: string | null
          receipt_date: string | null
          store_name: string | null
          total_amount: number
          updated_at: string
          upload_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          processed_at?: string | null
          receipt_date?: string | null
          store_name?: string | null
          total_amount: number
          updated_at?: string
          upload_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          processed_at?: string | null
          receipt_date?: string | null
          store_name?: string | null
          total_amount?: number
          updated_at?: string
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_documents: {
        Row: {
          created_at: string
          document_name: string
          document_type: string
          expense_id: string | null
          file_path: string | null
          file_size: number | null
          id: string
          tax_year: number
          upload_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_name: string
          document_type: string
          expense_id?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          tax_year: number
          upload_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_name?: string
          document_type?: string
          expense_id?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          tax_year?: number
          upload_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_documents_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_tags: {
        Row: {
          created_at: string
          expense_id: string
          id: string
          tag_name: string
          tag_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expense_id: string
          id?: string
          tag_name: string
          tag_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expense_id?: string
          id?: string
          tag_name?: string
          tag_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_tags_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_date: string
          consent_type: string
          consented: boolean
          created_at: string
          id: string
          ip_address: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consent_date?: string
          consent_type: string
          consented?: boolean
          created_at?: string
          id?: string
          ip_address?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consent_date?: string
          consent_type?: string
          consented?: boolean
          created_at?: string
          id?: string
          ip_address?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_progress: {
        Args: { row_id: number; amount_to_add: number }
        Returns: number
      }
      increment_amount: {
        Args: { row_id: number; amount_to_add: number }
        Returns: number
      }
      update_budget_period_totals: {
        Args: { period_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

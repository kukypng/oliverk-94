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
      admin_audit_log: {
        Row: {
          action_details: Json | null
          action_type: string
          admin_user_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          admin_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          admin_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_audit_log_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_logs: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          password: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password?: string
          username?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      budget_parts: {
        Row: {
          brand_id: string | null
          budget_id: string
          cash_price: number | null
          created_at: string
          id: string
          installment_price: number | null
          name: string
          part_type: string | null
          price: number
          quantity: number
          warranty_months: number | null
        }
        Insert: {
          brand_id?: string | null
          budget_id: string
          cash_price?: number | null
          created_at?: string
          id?: string
          installment_price?: number | null
          name: string
          part_type?: string | null
          price: number
          quantity?: number
          warranty_months?: number | null
        }
        Update: {
          brand_id?: string | null
          budget_id?: string
          cash_price?: number | null
          created_at?: string
          id?: string
          installment_price?: number | null
          name?: string
          part_type?: string | null
          price?: number
          quantity?: number
          warranty_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_parts_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_parts_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_budget_parts_brand_id"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_budget_parts_budget_id"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          cash_price: number | null
          client_name: string | null
          client_phone: string | null
          created_at: string
          delivery_date: string | null
          device_brand: string | null
          device_model: string
          device_type: string
          id: string
          includes_delivery: boolean | null
          includes_screen_protector: boolean | null
          installment_price: number | null
          installments: number | null
          issue: string
          notes: string | null
          owner_id: string
          part_type: string | null
          payment_condition: string | null
          search_vector: unknown | null
          status: string
          total_price: number
          updated_at: string
          valid_until: string | null
          warranty_months: number | null
        }
        Insert: {
          cash_price?: number | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string
          delivery_date?: string | null
          device_brand?: string | null
          device_model: string
          device_type: string
          id?: string
          includes_delivery?: boolean | null
          includes_screen_protector?: boolean | null
          installment_price?: number | null
          installments?: number | null
          issue: string
          notes?: string | null
          owner_id?: string
          part_type?: string | null
          payment_condition?: string | null
          search_vector?: unknown | null
          status?: string
          total_price: number
          updated_at?: string
          valid_until?: string | null
          warranty_months?: number | null
        }
        Update: {
          cash_price?: number | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string
          delivery_date?: string | null
          device_brand?: string | null
          device_model?: string
          device_type?: string
          id?: string
          includes_delivery?: boolean | null
          includes_screen_protector?: boolean | null
          installment_price?: number | null
          installments?: number | null
          issue?: string
          notes?: string | null
          owner_id?: string
          part_type?: string | null
          payment_condition?: string | null
          search_vector?: unknown | null
          status?: string
          total_price?: number
          updated_at?: string
          valid_until?: string | null
          warranty_months?: number | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      defect_types: {
        Row: {
          created_at: string
          id: string
          label: string
          user_id: string | null
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          user_id?: string | null
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          user_id?: string | null
          value?: string
        }
        Relationships: []
      }
      device_types: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      payment_conditions: {
        Row: {
          created_at: string
          id: string
          installments: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          installments?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          installments?: number
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          role: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          role?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
      shop_profiles: {
        Row: {
          address: string
          cnpj: string | null
          contact_phone: string
          created_at: string
          id: string
          logo_url: string | null
          shop_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          cnpj?: string | null
          contact_phone: string
          created_at?: string
          id?: string
          logo_url?: string | null
          shop_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          cnpj?: string | null
          contact_phone?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          shop_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity_metrics: {
        Row: {
          avg_session_duration: unknown | null
          created_at: string | null
          id: string
          last_activity_at: string | null
          login_count: number | null
          total_budgets_created: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avg_session_duration?: unknown | null
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          login_count?: number | null
          total_budgets_created?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avg_session_duration?: unknown | null
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          login_count?: number | null
          total_budgets_created?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          budget_limit: number | null
          budget_warning_days: number
          budget_warning_enabled: boolean
          created_at: string
          expiration_date: string
          id: string
          is_active: boolean
          name: string
          role: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          budget_limit?: number | null
          budget_warning_days?: number
          budget_warning_enabled?: boolean
          created_at?: string
          expiration_date?: string
          id: string
          is_active?: boolean
          name: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          budget_limit?: number | null
          budget_warning_days?: number
          budget_warning_enabled?: boolean
          created_at?: string
          expiration_date?: string
          id?: string
          is_active?: boolean
          name?: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      warranty_periods: {
        Row: {
          created_at: string
          id: string
          label: string
          months: number
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          months: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          months?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_delete_user: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      admin_get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          email: string
          role: string
          is_active: boolean
          expiration_date: string
          created_at: string
          last_sign_in_at: string
          budget_count: number
        }[]
      }
      admin_get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      admin_get_logs: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          admin_user_id: string
          admin_name: string
          target_user_id: string
          target_name: string
          action: string
          details: Json
          created_at: string
        }[]
      }
      admin_get_users_paginated: {
        Args: {
          p_page?: number
          p_limit?: number
          p_search?: string
          p_role_filter?: string
          p_status_filter?: string
          p_sort_by?: string
          p_sort_order?: string
        }
        Returns: Json
      }
      admin_log_audit_action: {
        Args: {
          p_target_user_id: string
          p_action_type: string
          p_action_details?: Json
        }
        Returns: undefined
      }
      admin_renew_user_license: {
        Args: { p_user_id: string; p_additional_days: number }
        Returns: boolean
      }
      admin_update_user: {
        Args: {
          p_user_id: string
          p_name?: string
          p_role?: string
          p_is_active?: boolean
          p_expiration_date?: string
        }
        Returns: boolean
      }
      check_if_user_is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      check_shop_profile_exists: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      cleanup_expired_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      count_user_budgets: {
        Args: { p_user_id: string }
        Returns: number
      }
      debug_current_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          user_email: string
          user_role: string
          is_active: boolean
          is_admin: boolean
        }[]
      }
      get_shop_profile: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_username_from_email: {
        Args: { email: string }
        Returns: string
      }
      has_reached_budget_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      insert_shop_profile: {
        Args: {
          p_user_id: string
          p_shop_name: string
          p_address: string
          p_contact_phone: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_license_valid: {
        Args: { p_user_id?: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_expired: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_action: {
        Args: { p_target_user_id: string; p_action: string; p_details?: Json }
        Returns: undefined
      }
      set_user_budget_limit: {
        Args: { p_user_id: string; p_budget_limit: number }
        Returns: boolean
      }
      test_admin_permissions: {
        Args: Record<PropertyKey, never>
        Returns: {
          test_name: string
          result: boolean
          details: string
        }[]
      }
      update_expired_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_shop_profile: {
        Args: {
          p_user_id: string
          p_shop_name: string
          p_address: string
          p_contact_phone: string
        }
        Returns: boolean
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

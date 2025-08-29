export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      buyer_profiles: {
        Row: {
          address: string | null
          cac_number: string | null
          company_name: string
          company_type: string | null
          created_at: string | null
          id: string
          lga_id: number | null
          payment_terms: string[] | null
          preferred_crops: string[] | null
          purchase_capacity_tons: number | null
          state_id: number | null
          tax_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          cac_number?: string | null
          company_name: string
          company_type?: string | null
          created_at?: string | null
          id?: string
          lga_id?: number | null
          payment_terms?: string[] | null
          preferred_crops?: string[] | null
          purchase_capacity_tons?: number | null
          state_id?: number | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          cac_number?: string | null
          company_name?: string
          company_type?: string | null
          created_at?: string | null
          id?: string
          lga_id?: number | null
          payment_terms?: string[] | null
          preferred_crops?: string[] | null
          purchase_capacity_tons?: number | null
          state_id?: number | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_profiles_lga_id_fkey"
            columns: ["lga_id"]
            isOneToOne: false
            referencedRelation: "lgas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_profiles_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_profiles: {
        Row: {
          address: string | null
          certifications: string[] | null
          created_at: string | null
          farm_name: string | null
          farm_size_hectares: number | null
          id: string
          latitude: number | null
          lga_id: number | null
          longitude: number | null
          primary_crops: string[] | null
          state_id: number | null
          updated_at: string | null
          user_id: string | null
          years_farming: number | null
        }
        Insert: {
          address?: string | null
          certifications?: string[] | null
          created_at?: string | null
          farm_name?: string | null
          farm_size_hectares?: number | null
          id?: string
          latitude?: number | null
          lga_id?: number | null
          longitude?: number | null
          primary_crops?: string[] | null
          state_id?: number | null
          updated_at?: string | null
          user_id?: string | null
          years_farming?: number | null
        }
        Update: {
          address?: string | null
          certifications?: string[] | null
          created_at?: string | null
          farm_name?: string | null
          farm_size_hectares?: number | null
          id?: string
          latitude?: number | null
          lga_id?: number | null
          longitude?: number | null
          primary_crops?: string[] | null
          state_id?: number | null
          updated_at?: string | null
          user_id?: string | null
          years_farming?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "farmer_profiles_lga_id_fkey"
            columns: ["lga_id"]
            isOneToOne: false
            referencedRelation: "lgas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_profiles_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lgas: {
        Row: {
          id: number
          name: string
          state_id: number | null
        }
        Insert: {
          id?: number
          name: string
          state_id?: number | null
        }
        Update: {
          id?: number
          name?: string
          state_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lgas_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string | null
          id: string
          inquiry_id: string | null
          is_read: boolean | null
          message_text: string
          message_type: string | null
          price_offer: number | null
          quantity_offer: number | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inquiry_id?: string | null
          is_read?: boolean | null
          message_text: string
          message_type?: string | null
          price_offer?: number | null
          quantity_offer?: number | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inquiry_id?: string | null
          is_read?: boolean | null
          message_text?: string
          message_type?: string | null
          price_offer?: number | null
          quantity_offer?: number | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "product_inquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string | null
          created_at: string | null
          delivery_address: string | null
          delivery_date: string | null
          farmer_id: string | null
          id: string
          inquiry_id: string | null
          notes: string | null
          payment_status: string | null
          product_id: string | null
          quantity: number
          status: string | null
          total_amount: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          farmer_id?: string | null
          id?: string
          inquiry_id?: string | null
          notes?: string | null
          payment_status?: string | null
          product_id?: string | null
          quantity: number
          status?: string | null
          total_amount: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          farmer_id?: string | null
          id?: string
          inquiry_id?: string | null
          notes?: string | null
          payment_status?: string | null
          product_id?: string | null
          quantity?: number
          status?: string | null
          total_amount?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "product_inquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_inquiries: {
        Row: {
          buyer_id: string | null
          id: string
          inquiry_date: string | null
          message: string | null
          product_id: string | null
          proposed_price_per_unit: number | null
          quantity_requested: number
          response_deadline: string | null
          status: string | null
        }
        Insert: {
          buyer_id?: string | null
          id?: string
          inquiry_date?: string | null
          message?: string | null
          product_id?: string | null
          proposed_price_per_unit?: number | null
          quantity_requested: number
          response_deadline?: string | null
          status?: string | null
        }
        Update: {
          buyer_id?: string | null
          id?: string
          inquiry_date?: string | null
          message?: string | null
          product_id?: string | null
          proposed_price_per_unit?: number | null
          quantity_requested?: number
          response_deadline?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_inquiries_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_inquiries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          available_from: string
          available_until: string | null
          created_at: string | null
          crop_type: string
          description: string | null
          farmer_id: string | null
          harvest_date: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_organic: boolean | null
          location_lga_id: number | null
          location_state_id: number | null
          price_per_unit: number
          quality_grade: string | null
          quantity_available: number
          storage_method: string | null
          title: string
          unit: string
          updated_at: string | null
          variety: string | null
        }
        Insert: {
          available_from: string
          available_until?: string | null
          created_at?: string | null
          crop_type: string
          description?: string | null
          farmer_id?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_organic?: boolean | null
          location_lga_id?: number | null
          location_state_id?: number | null
          price_per_unit: number
          quality_grade?: string | null
          quantity_available: number
          storage_method?: string | null
          title: string
          unit: string
          updated_at?: string | null
          variety?: string | null
        }
        Update: {
          available_from?: string
          available_until?: string | null
          created_at?: string | null
          crop_type?: string
          description?: string | null
          farmer_id?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_organic?: boolean | null
          location_lga_id?: number | null
          location_state_id?: number | null
          price_per_unit?: number
          quality_grade?: string | null
          quantity_available?: number
          storage_method?: string | null
          title?: string
          unit?: string
          updated_at?: string | null
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_location_lga_id_fkey"
            columns: ["location_lga_id"]
            isOneToOne: false
            referencedRelation: "lgas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_location_state_id_fkey"
            columns: ["location_state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          is_approved: boolean | null
          is_verified: boolean | null
          phone: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id: string
          is_approved?: boolean | null
          is_verified?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          is_approved?: boolean | null
          is_verified?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          order_id: string | null
          rating: number
          review_type: string | null
          reviewee_id: string | null
          reviewer_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          rating: number
          review_type?: string | null
          reviewee_id?: string | null
          reviewer_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          rating?: number
          review_type?: string | null
          reviewee_id?: string | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      states: {
        Row: {
          code: string
          id: number
          name: string
        }
        Insert: {
          code: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      affiliate_enquiries: {
        Row: {
          audience_type: string | null
          company: string | null
          created_at: string
          email: string
          expected_referrals: string | null
          experience: string | null
          full_name: string
          hear_about: string | null
          id: string
          location: string | null
          message: string
          phone: string
          status: string
          website: string | null
        }
        Insert: {
          audience_type?: string | null
          company?: string | null
          created_at?: string
          email: string
          expected_referrals?: string | null
          experience?: string | null
          full_name: string
          hear_about?: string | null
          id?: string
          location?: string | null
          message: string
          phone: string
          status?: string
          website?: string | null
        }
        Update: {
          audience_type?: string | null
          company?: string | null
          created_at?: string
          email?: string
          expected_referrals?: string | null
          experience?: string | null
          full_name?: string
          hear_about?: string | null
          id?: string
          location?: string | null
          message?: string
          phone?: string
          status?: string
          website?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string | null
          category: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          title: string
        }
        Insert: {
          author_name?: string | null
          category?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          title: string
        }
        Update: {
          author_name?: string | null
          category?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      capabilities: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          meta: string
          sort_order: number
          tag: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string
          id?: string
          is_active?: boolean
          meta?: string
          sort_order?: number
          tag: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          meta?: string
          sort_order?: number
          tag?: string
          title?: string
        }
        Relationships: []
      }
      career_applications: {
        Row: {
          cover_message: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          position_applied: string
          resume_url: string | null
          status: string
        }
        Insert: {
          cover_message?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          position_applied: string
          resume_url?: string | null
          status?: string
        }
        Update: {
          cover_message?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          position_applied?: string
          resume_url?: string | null
          status?: string
        }
        Relationships: []
      }
      client_messages: {
        Row: {
          attachments: Json
          body: string
          created_at: string
          id: string
          onboarding_id: string
          read_by_admin_at: string | null
          read_by_client_at: string | null
          sender_id: string | null
          sender_name: string | null
          sender_role: string
        }
        Insert: {
          attachments?: Json
          body: string
          created_at?: string
          id?: string
          onboarding_id: string
          read_by_admin_at?: string | null
          read_by_client_at?: string | null
          sender_id?: string | null
          sender_name?: string | null
          sender_role: string
        }
        Update: {
          attachments?: Json
          body?: string
          created_at?: string
          id?: string
          onboarding_id?: string
          read_by_admin_at?: string | null
          read_by_client_at?: string | null
          sender_id?: string | null
          sender_name?: string | null
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_messages_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "client_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      client_onboarding: {
        Row: {
          access: Json
          assets: Json
          checklist: Json
          company_name: string
          contact_person: string | null
          created_at: string
          email: string | null
          features_needed: string | null
          id: string
          integrations_needed: string | null
          notes: string | null
          package_selected: string | null
          pages_needed: string | null
          phone: string | null
          project_goals: string | null
          project_manager: string | null
          project_type: string | null
          status: Database["public"]["Enums"]["onboarding_status"]
          target_launch_date: string | null
          updated_at: string
        }
        Insert: {
          access?: Json
          assets?: Json
          checklist?: Json
          company_name: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          features_needed?: string | null
          id?: string
          integrations_needed?: string | null
          notes?: string | null
          package_selected?: string | null
          pages_needed?: string | null
          phone?: string | null
          project_goals?: string | null
          project_manager?: string | null
          project_type?: string | null
          status?: Database["public"]["Enums"]["onboarding_status"]
          target_launch_date?: string | null
          updated_at?: string
        }
        Update: {
          access?: Json
          assets?: Json
          checklist?: Json
          company_name?: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          features_needed?: string | null
          id?: string
          integrations_needed?: string | null
          notes?: string | null
          package_selected?: string | null
          pages_needed?: string | null
          phone?: string | null
          project_goals?: string | null
          project_manager?: string | null
          project_type?: string | null
          status?: Database["public"]["Enums"]["onboarding_status"]
          target_launch_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      client_reports: {
        Row: {
          client_name: string
          created_at: string
          id: string
          leads_from_forms: number
          month: string
          next_month_recommendation: string | null
          site_visitors: number
          top_pages: string[]
          uptime_percentage: number
          whatsapp_taps: number
          work_done_this_month: string | null
        }
        Insert: {
          client_name: string
          created_at?: string
          id?: string
          leads_from_forms?: number
          month: string
          next_month_recommendation?: string | null
          site_visitors?: number
          top_pages?: string[]
          uptime_percentage?: number
          whatsapp_taps?: number
          work_done_this_month?: string | null
        }
        Update: {
          client_name?: string
          created_at?: string
          id?: string
          leads_from_forms?: number
          month?: string
          next_month_recommendation?: string | null
          site_visitors?: number
          top_pages?: string[]
          uptime_percentage?: number
          whatsapp_taps?: number
          work_done_this_month?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          business_type: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          message: string
          name: string
          phone: string | null
          status: string
        }
        Insert: {
          business_type?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
        }
        Update: {
          business_type?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      job_openings: {
        Row: {
          created_at: string
          department: string
          description: string | null
          id: string
          is_active: boolean
          location: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          department: string
          description?: string | null
          id?: string
          is_active?: boolean
          location: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          department?: string
          description?: string | null
          id?: string
          is_active?: boolean
          location?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          category: string
          challenge: string | null
          client_industry: string
          created_at: string
          id: string
          is_featured: boolean
          results: string | null
          screenshot_urls: string[]
          solution: string | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          category: string
          challenge?: string | null
          client_industry: string
          created_at?: string
          id?: string
          is_featured?: boolean
          results?: string | null
          screenshot_urls?: string[]
          solution?: string | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          category?: string
          challenge?: string | null
          client_industry?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          results?: string | null
          screenshot_urls?: string[]
          solution?: string | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      quarterly_addons: {
        Row: {
          addon_type: string
          client_name: string
          completed_date: string | null
          created_at: string
          id: string
          quarter: string
          scheduled_date: string | null
          status: string
        }
        Insert: {
          addon_type: string
          client_name: string
          completed_date?: string | null
          created_at?: string
          id?: string
          quarter: string
          scheduled_date?: string | null
          status?: string
        }
        Update: {
          addon_type?: string
          client_name?: string
          completed_date?: string | null
          created_at?: string
          id?: string
          quarter?: string
          scheduled_date?: string | null
          status?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_name: string
          company: string | null
          country: string | null
          created_at: string
          id: string
          is_featured: boolean
          quote: string
          rating: number
        }
        Insert: {
          client_name: string
          company?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          quote: string
          rating?: number
        }
        Update: {
          client_name?: string
          company?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          quote?: string
          rating?: number
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
      onboarding_status:
        | "pending"
        | "waiting_on_client"
        | "in_review"
        | "kickoff_ready"
        | "active_project"
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
    Enums: {
      onboarding_status: [
        "pending",
        "waiting_on_client",
        "in_review",
        "kickoff_ready",
        "active_project",
      ],
    },
  },
} as const

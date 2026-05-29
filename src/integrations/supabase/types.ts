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
      blog_posts: {
        Row: {
          body_ro: string | null
          body_ru: string | null
          cover_image: string | null
          created_at: string
          excerpt_ro: string | null
          excerpt_ru: string | null
          id: string
          is_published: boolean
          published_at: string
          slug: string
          title_ro: string
          title_ru: string
          updated_at: string
        }
        Insert: {
          body_ro?: string | null
          body_ru?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt_ro?: string | null
          excerpt_ru?: string | null
          id?: string
          is_published?: boolean
          published_at?: string
          slug: string
          title_ro: string
          title_ru: string
          updated_at?: string
        }
        Update: {
          body_ro?: string | null
          body_ru?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt_ro?: string | null
          excerpt_ru?: string | null
          id?: string
          is_published?: boolean
          published_at?: string
          slug?: string
          title_ro?: string
          title_ru?: string
          updated_at?: string
        }
        Relationships: []
      }
      destination_faq: {
        Row: {
          answer_ro: string | null
          answer_ru: string | null
          created_at: string
          destination_slug: string
          id: string
          question_ro: string
          question_ru: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer_ro?: string | null
          answer_ru?: string | null
          created_at?: string
          destination_slug: string
          id?: string
          question_ro: string
          question_ru: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer_ro?: string | null
          answer_ru?: string | null
          created_at?: string
          destination_slug?: string
          id?: string
          question_ro?: string
          question_ru?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      destination_gallery_images: {
        Row: {
          alt_ro: string | null
          alt_ru: string | null
          author: string | null
          created_at: string
          destination_slug: string
          id: string
          image_url: string
          license: string | null
          sort_order: number
          source_url: string | null
          updated_at: string
        }
        Insert: {
          alt_ro?: string | null
          alt_ru?: string | null
          author?: string | null
          created_at?: string
          destination_slug: string
          id?: string
          image_url: string
          license?: string | null
          sort_order?: number
          source_url?: string | null
          updated_at?: string
        }
        Update: {
          alt_ro?: string | null
          alt_ru?: string | null
          author?: string | null
          created_at?: string
          destination_slug?: string
          id?: string
          image_url?: string
          license?: string | null
          sort_order?: number
          source_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      destination_inclusions: {
        Row: {
          created_at: string
          destination_slug: string
          id: string
          kind: string
          sort_order: number
          text_ro: string
          text_ru: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_slug: string
          id?: string
          kind: string
          sort_order?: number
          text_ro: string
          text_ru: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_slug?: string
          id?: string
          kind?: string
          sort_order?: number
          text_ro?: string
          text_ru?: string
          updated_at?: string
        }
        Relationships: []
      }
      destination_program_days: {
        Row: {
          created_at: string
          day_label_ro: string | null
          day_label_ru: string | null
          description_ro: string | null
          description_ru: string | null
          destination_slug: string
          id: string
          sort_order: number
          title_ro: string
          title_ru: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_label_ro?: string | null
          day_label_ru?: string | null
          description_ro?: string | null
          description_ru?: string | null
          destination_slug: string
          id?: string
          sort_order?: number
          title_ro: string
          title_ru: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_label_ro?: string | null
          day_label_ru?: string | null
          description_ro?: string | null
          description_ru?: string | null
          destination_slug?: string
          id?: string
          sort_order?: number
          title_ro?: string
          title_ru?: string
          updated_at?: string
        }
        Relationships: []
      }
      destination_shrines: {
        Row: {
          created_at: string
          destination_slug: string
          full_ro: string | null
          full_ru: string | null
          id: string
          image_url: string | null
          short_ro: string | null
          short_ru: string | null
          sort_order: number
          title_ro: string
          title_ru: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_slug: string
          full_ro?: string | null
          full_ru?: string | null
          id?: string
          image_url?: string | null
          short_ro?: string | null
          short_ru?: string | null
          sort_order?: number
          title_ro: string
          title_ru: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_slug?: string
          full_ro?: string | null
          full_ru?: string | null
          id?: string
          image_url?: string | null
          short_ro?: string | null
          short_ru?: string | null
          sort_order?: number
          title_ro?: string
          title_ru?: string
          updated_at?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          accompaniment_ro: string | null
          accompaniment_ru: string | null
          cover_image: string | null
          created_at: string
          description_ro: string | null
          description_ru: string | null
          duration_ro: string | null
          duration_ru: string | null
          group_size_ro: string | null
          group_size_ru: string | null
          hero_quote_author_ro: string | null
          hero_quote_author_ru: string | null
          hero_quote_ro: string | null
          hero_quote_ru: string | null
          id: string
          intro_ro: string | null
          intro_ru: string | null
          is_published: boolean
          notice_ro: string | null
          notice_ru: string | null
          og_image: string | null
          price_from: number | null
          program_ro: string | null
          program_ru: string | null
          seo_description_ro: string | null
          seo_description_ru: string | null
          seo_title_ro: string | null
          seo_title_ru: string | null
          slug: string
          title_ro: string
          title_ru: string
          updated_at: string
        }
        Insert: {
          accompaniment_ro?: string | null
          accompaniment_ru?: string | null
          cover_image?: string | null
          created_at?: string
          description_ro?: string | null
          description_ru?: string | null
          duration_ro?: string | null
          duration_ru?: string | null
          group_size_ro?: string | null
          group_size_ru?: string | null
          hero_quote_author_ro?: string | null
          hero_quote_author_ru?: string | null
          hero_quote_ro?: string | null
          hero_quote_ru?: string | null
          id?: string
          intro_ro?: string | null
          intro_ru?: string | null
          is_published?: boolean
          notice_ro?: string | null
          notice_ru?: string | null
          og_image?: string | null
          price_from?: number | null
          program_ro?: string | null
          program_ru?: string | null
          seo_description_ro?: string | null
          seo_description_ru?: string | null
          seo_title_ro?: string | null
          seo_title_ru?: string | null
          slug: string
          title_ro: string
          title_ru: string
          updated_at?: string
        }
        Update: {
          accompaniment_ro?: string | null
          accompaniment_ru?: string | null
          cover_image?: string | null
          created_at?: string
          description_ro?: string | null
          description_ru?: string | null
          duration_ro?: string | null
          duration_ru?: string | null
          group_size_ro?: string | null
          group_size_ru?: string | null
          hero_quote_author_ro?: string | null
          hero_quote_author_ru?: string | null
          hero_quote_ro?: string | null
          hero_quote_ru?: string | null
          id?: string
          intro_ro?: string | null
          intro_ru?: string | null
          is_published?: boolean
          notice_ro?: string | null
          notice_ru?: string | null
          og_image?: string | null
          price_from?: number | null
          program_ro?: string | null
          program_ru?: string | null
          seo_description_ro?: string | null
          seo_description_ru?: string | null
          seo_title_ro?: string | null
          seo_title_ru?: string | null
          slug?: string
          title_ro?: string
          title_ru?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_read: boolean
          message: string | null
          name: string
          phone: string
          read_at: string | null
          source: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_read?: boolean
          message?: string | null
          name: string
          phone: string
          read_at?: string | null
          source: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_read?: boolean
          message?: string | null
          name?: string
          phone?: string
          read_at?: string | null
          source?: string
        }
        Relationships: []
      }
      pilgrimages: {
        Row: {
          cover_image: string | null
          created_at: string
          description_ro: string | null
          description_ru: string | null
          destination_ro: string
          destination_ru: string
          end_date: string
          id: string
          is_published: boolean
          price_eur: number | null
          slug: string
          start_date: string
          title_ro: string
          title_ru: string
          updated_at: string
          with_priest: boolean
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description_ro?: string | null
          description_ru?: string | null
          destination_ro: string
          destination_ru: string
          end_date: string
          id?: string
          is_published?: boolean
          price_eur?: number | null
          slug: string
          start_date: string
          title_ro: string
          title_ru: string
          updated_at?: string
          with_priest?: boolean
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description_ro?: string | null
          description_ru?: string | null
          destination_ro?: string
          destination_ru?: string
          end_date?: string
          id?: string
          is_published?: boolean
          price_eur?: number | null
          slug?: string
          start_date?: string
          title_ro?: string
          title_ru?: string
          updated_at?: string
          with_priest?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
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
      app_role: ["admin"],
    },
  },
} as const

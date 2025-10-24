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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      block: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          key: string
          media: Json | null
          page_id: string | null
          sort: number | null
          title: Json | null
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          key: string
          media?: Json | null
          page_id?: string | null
          sort?: number | null
          title?: Json | null
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          key?: string
          media?: Json | null
          page_id?: string | null
          sort?: number | null
          title?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "block_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "page"
            referencedColumns: ["id"]
          },
        ]
      }
      content_analytics: {
        Row: {
          created_at: string | null
          date: string
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          metric: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          metric: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          metric?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      event: {
        Row: {
          body: Json | null
          capacity: number | null
          city: Json | null
          cover_url: string | null
          created_at: string | null
          end_at: string
          external_url: string | null
          gallery: Json | null
          id: string
          slug: string
          start_at: string
          status: string | null
          summary: Json | null
          title: Json
          updated_at: string | null
          venue: Json | null
        }
        Insert: {
          body?: Json | null
          capacity?: number | null
          city?: Json | null
          cover_url?: string | null
          created_at?: string | null
          end_at: string
          external_url?: string | null
          gallery?: Json | null
          id?: string
          slug: string
          start_at: string
          status?: string | null
          summary?: Json | null
          title: Json
          updated_at?: string | null
          venue?: Json | null
        }
        Update: {
          body?: Json | null
          capacity?: number | null
          city?: Json | null
          cover_url?: string | null
          created_at?: string | null
          end_at?: string
          external_url?: string | null
          gallery?: Json | null
          id?: string
          slug?: string
          start_at?: string
          status?: string | null
          summary?: Json | null
          title?: Json
          updated_at?: string | null
          venue?: Json | null
        }
        Relationships: []
      }
      kpi: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value_dec: number | null
          value_int: number | null
          value_text: Json | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value_dec?: number | null
          value_int?: number | null
          value_text?: Json | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value_dec?: number | null
          value_int?: number | null
          value_text?: Json | null
          year?: number | null
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: Json
          caption: Json | null
          category: string
          created_at: string
          file_size: number | null
          filename: string
          height: number | null
          id: string
          is_featured: boolean | null
          mime_type: string | null
          prompt: string | null
          public_url: string | null
          source: string
          source_attribution: string | null
          storage_path: string
          tags: string[] | null
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text?: Json
          caption?: Json | null
          category: string
          created_at?: string
          file_size?: number | null
          filename: string
          height?: number | null
          id?: string
          is_featured?: boolean | null
          mime_type?: string | null
          prompt?: string | null
          public_url?: string | null
          source: string
          source_attribution?: string | null
          storage_path: string
          tags?: string[] | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: Json
          caption?: Json | null
          category?: string
          created_at?: string
          file_size?: number | null
          filename?: string
          height?: number | null
          id?: string
          is_featured?: boolean | null
          mime_type?: string | null
          prompt?: string | null
          public_url?: string | null
          source?: string
          source_attribution?: string | null
          storage_path?: string
          tags?: string[] | null
          updated_at?: string
          width?: number | null
        }
        Relationships: []
      }
      menu: {
        Row: {
          created_at: string | null
          id: string
          items: Json
          key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          items: Json
          key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          items?: Json
          key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      page: {
        Row: {
          body: Json | null
          created_at: string | null
          excerpt: Json | null
          id: string
          published_at: string | null
          seo_desc: Json | null
          seo_title: Json | null
          slug: string
          status: string | null
          title: Json
          updated_at: string | null
        }
        Insert: {
          body?: Json | null
          created_at?: string | null
          excerpt?: Json | null
          id?: string
          published_at?: string | null
          seo_desc?: Json | null
          seo_title?: Json | null
          slug: string
          status?: string | null
          title: Json
          updated_at?: string | null
        }
        Update: {
          body?: Json | null
          created_at?: string | null
          excerpt?: Json | null
          id?: string
          published_at?: string | null
          seo_desc?: Json | null
          seo_title?: Json | null
          slug?: string
          status?: string | null
          title?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      partner: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: Json
          sort: number | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: Json
          sort?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: Json
          sort?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      post: {
        Row: {
          body: Json | null
          cover_url: string | null
          created_at: string | null
          excerpt: Json | null
          id: string
          published_at: string | null
          slug: string
          status: string | null
          title: Json
          type: string | null
          updated_at: string | null
        }
        Insert: {
          body?: Json | null
          cover_url?: string | null
          created_at?: string | null
          excerpt?: Json | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string | null
          title: Json
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: Json | null
          cover_url?: string | null
          created_at?: string | null
          excerpt?: Json | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: Json
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      program: {
        Row: {
          body: Json | null
          cover_url: string | null
          created_at: string | null
          icon: string | null
          id: string
          slug: string
          status: string | null
          summary: Json | null
          title: Json
          updated_at: string | null
        }
        Insert: {
          body?: Json | null
          cover_url?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          slug: string
          status?: string | null
          summary?: Json | null
          title: Json
          updated_at?: string | null
        }
        Update: {
          body?: Json | null
          cover_url?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          slug?: string
          status?: string | null
          summary?: Json | null
          title?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          address: Json | null
          analytics: Json | null
          created_at: string | null
          default_images: Json | null
          default_meta_desc: Json | null
          default_meta_title: Json | null
          emails: Json | null
          id: string
          org_name: string
          phone: string | null
          socials: Json | null
          updated_at: string | null
          working: Json | null
        }
        Insert: {
          address?: Json | null
          analytics?: Json | null
          created_at?: string | null
          default_images?: Json | null
          default_meta_desc?: Json | null
          default_meta_title?: Json | null
          emails?: Json | null
          id?: string
          org_name?: string
          phone?: string | null
          socials?: Json | null
          updated_at?: string | null
          working?: Json | null
        }
        Update: {
          address?: Json | null
          analytics?: Json | null
          created_at?: string | null
          default_images?: Json | null
          default_meta_desc?: Json | null
          default_meta_title?: Json | null
          emails?: Json | null
          id?: string
          org_name?: string
          phone?: string | null
          socials?: Json | null
          updated_at?: string | null
          working?: Json | null
        }
        Relationships: []
      }
      submission: {
        Row: {
          created_at: string | null
          data: Json
          form_type: string
          id: string
        }
        Insert: {
          created_at?: string | null
          data: Json
          form_type: string
          id?: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          form_type?: string
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      video: {
        Row: {
          channel: Json | null
          created_at: string
          description: Json | null
          id: string
          published_at: string | null
          sort: number | null
          status: string | null
          tags: Json | null
          thumbnail_url: string | null
          title: Json
          updated_at: string
          youtube_id: string
        }
        Insert: {
          channel?: Json | null
          created_at?: string
          description?: Json | null
          id?: string
          published_at?: string | null
          sort?: number | null
          status?: string | null
          tags?: Json | null
          thumbnail_url?: string | null
          title?: Json
          updated_at?: string
          youtube_id: string
        }
        Update: {
          channel?: Json | null
          created_at?: string
          description?: Json | null
          id?: string
          published_at?: string | null
          sort?: number | null
          status?: string | null
          tags?: Json | null
          thumbnail_url?: string | null
          title?: Json
          updated_at?: string
          youtube_id?: string
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
      app_role: "SUPERADMIN" | "EDITOR" | "VIEWER"
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
      app_role: ["SUPERADMIN", "EDITOR", "VIEWER"],
    },
  },
} as const

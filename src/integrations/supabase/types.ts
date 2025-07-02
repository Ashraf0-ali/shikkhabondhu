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
      admin_settings: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          password_hash: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          password_hash: string
          updated_at?: string | null
          username?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          password_hash?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          api_key: string
          created_at: string
          id: string
          is_active: boolean | null
          provider: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          provider: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          provider?: string
        }
        Relationships: []
      }
      board_questions: {
        Row: {
          board: string
          created_at: string
          file_type: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          seo_description: string | null
          seo_tags: string | null
          seo_title: string | null
          subject: string
          title: string
          year: number
        }
        Insert: {
          board: string
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          seo_description?: string | null
          seo_tags?: string | null
          seo_title?: string | null
          subject: string
          title: string
          year: number
        }
        Update: {
          board?: string
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          seo_description?: string | null
          seo_tags?: string | null
          seo_title?: string | null
          subject?: string
          title?: string
          year?: number
        }
        Relationships: []
      }
      chatbot_settings: {
        Row: {
          allowed_models: string[] | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          max_daily_requests: number | null
          system_prompt: string | null
          updated_at: string | null
        }
        Insert: {
          allowed_models?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          max_daily_requests?: number | null
          system_prompt?: string | null
          updated_at?: string | null
        }
        Update: {
          allowed_models?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          max_daily_requests?: number | null
          system_prompt?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Contacts: {
        Row: {}
        Insert: {}
        Update: {}
        Relationships: []
      }
      mcq_questions: {
        Row: {
          admission_info: Json | null
          board: string | null
          chapter: string | null
          class_level: string | null
          correct_answer: string
          created_at: string
          id: string
          metadata: Json | null
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          question: string
          question_type: string | null
          subject: string
          updated_at: string
          year: number | null
        }
        Insert: {
          admission_info?: Json | null
          board?: string | null
          chapter?: string | null
          class_level?: string | null
          correct_answer: string
          created_at?: string
          id?: string
          metadata?: Json | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          question: string
          question_type?: string | null
          subject: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          admission_info?: Json | null
          board?: string | null
          chapter?: string | null
          class_level?: string | null
          correct_answer?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          question?: string
          question_type?: string | null
          subject?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      motivational_quotes: {
        Row: {
          author: string | null
          created_at: string
          id: string
          is_active: boolean | null
          quote: string
          tags: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          quote: string
          tags?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          quote?: string
          tags?: string | null
        }
        Relationships: []
      }
      nctb_books: {
        Row: {
          chapter: string | null
          class_level: number
          content: string | null
          created_at: string
          file_type: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          seo_description: string | null
          seo_tags: string | null
          seo_title: string | null
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          chapter?: string | null
          class_level: number
          content?: string | null
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          seo_description?: string | null
          seo_tags?: string | null
          seo_title?: string | null
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          chapter?: string | null
          class_level?: number
          content?: string | null
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          seo_description?: string | null
          seo_tags?: string | null
          seo_title?: string | null
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          chapter: string | null
          content: string | null
          created_at: string
          file_type: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          seo_description: string | null
          seo_tags: string | null
          seo_title: string | null
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          chapter?: string | null
          content?: string | null
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          seo_description?: string | null
          seo_tags?: string | null
          seo_title?: string | null
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          chapter?: string | null
          content?: string | null
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          seo_description?: string | null
          seo_tags?: string | null
          seo_title?: string | null
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tips_feedback: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string
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

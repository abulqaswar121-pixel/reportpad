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
      class_teachers: {
        Row: {
          class_id: string
          created_at: string
          id: string
          teacher_user_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          teacher_user_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          teacher_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_teachers_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          category: string
          color: string | null
          created_at: string
          id: string
          locked: boolean
          name: string
          school_id: string
          subjects: string[]
          teacher_password_hash: string | null
        }
        Insert: {
          category: string
          color?: string | null
          created_at?: string
          id?: string
          locked?: boolean
          name: string
          school_id: string
          subjects?: string[]
          teacher_password_hash?: string | null
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string
          id?: string
          locked?: boolean
          name?: string
          school_id?: string
          subjects?: string[]
          teacher_password_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          class_id: string
          days_present: number | null
          days_total: number | null
          head_teacher_comment: string | null
          id: string
          student_id: string
          teacher_comment: string | null
          updated_at: string
        }
        Insert: {
          class_id: string
          days_present?: number | null
          days_total?: number | null
          head_teacher_comment?: string | null
          id?: string
          student_id: string
          teacher_comment?: string | null
          updated_at?: string
        }
        Update: {
          class_id?: string
          days_present?: number | null
          days_total?: number | null
          head_teacher_comment?: string | null
          id?: string
          student_id?: string
          teacher_comment?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          ca1: number | null
          ca2: number | null
          class_id: string
          exam: number | null
          grade: string | null
          id: string
          remark: string | null
          student_id: string
          subject: string
          total: number | null
          updated_at: string
        }
        Insert: {
          ca1?: number | null
          ca2?: number | null
          class_id: string
          exam?: number | null
          grade?: string | null
          id?: string
          remark?: string | null
          student_id: string
          subject: string
          total?: number | null
          updated_at?: string
        }
        Update: {
          ca1?: number | null
          ca2?: number | null
          class_id?: string
          exam?: number | null
          grade?: string | null
          id?: string
          remark?: string | null
          student_id?: string
          subject?: string
          total?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grades_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      ms_halqahs: {
        Row: {
          class_label: string
          created_at: string
          days_open: number | null
          id: string
          logo_url: string | null
          name: string
          next_term_begins: string | null
          password_hash: string | null
          session: string | null
          teacher_name: string
          term: string | null
          updated_at: string
        }
        Insert: {
          class_label?: string
          created_at?: string
          days_open?: number | null
          id?: string
          logo_url?: string | null
          name: string
          next_term_begins?: string | null
          password_hash?: string | null
          session?: string | null
          teacher_name?: string
          term?: string | null
          updated_at?: string
        }
        Update: {
          class_label?: string
          created_at?: string
          days_open?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          next_term_begins?: string | null
          password_hash?: string | null
          session?: string | null
          teacher_name?: string
          term?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ms_reports: {
        Row: {
          attendance: Json
          class_average: number | null
          created_at: string
          days_absent: number | null
          head_comment: string
          head_comment_override: string | null
          id: string
          learner_average: number | null
          next_term_begins: string
          session: string
          student_id: string
          subjects: Json
          teacher_comment: string
          teacher_comment_override: string | null
          term: string
          traits: Json
          updated_at: string
        }
        Insert: {
          attendance?: Json
          class_average?: number | null
          created_at?: string
          days_absent?: number | null
          head_comment?: string
          head_comment_override?: string | null
          id?: string
          learner_average?: number | null
          next_term_begins?: string
          session: string
          student_id: string
          subjects?: Json
          teacher_comment?: string
          teacher_comment_override?: string | null
          term: string
          traits?: Json
          updated_at?: string
        }
        Update: {
          attendance?: Json
          class_average?: number | null
          created_at?: string
          days_absent?: number | null
          head_comment?: string
          head_comment_override?: string | null
          id?: string
          learner_average?: number | null
          next_term_begins?: string
          session?: string
          student_id?: string
          subjects?: Json
          teacher_comment?: string
          teacher_comment_override?: string | null
          term?: string
          traits?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ms_reports_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "ms_students"
            referencedColumns: ["id"]
          },
        ]
      }
      ms_students: {
        Row: {
          admission_no: string
          class_label: string | null
          created_at: string
          full_name: string
          halqah_id: string
          id: string
          parent_contact: string | null
          sex: string
          updated_at: string
        }
        Insert: {
          admission_no?: string
          class_label?: string | null
          created_at?: string
          full_name: string
          halqah_id: string
          id?: string
          parent_contact?: string | null
          sex?: string
          updated_at?: string
        }
        Update: {
          admission_no?: string
          class_label?: string | null
          created_at?: string
          full_name?: string
          halqah_id?: string
          id?: string
          parent_contact?: string | null
          sex?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ms_students_halqah_id_fkey"
            columns: ["halqah_id"]
            isOneToOne: false
            referencedRelation: "ms_halqahs"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          access_code: string | null
          address: string | null
          admin_name: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          motto: string | null
          name: string
          onboarding_complete: boolean
          owner_user_id: string
          phone: string | null
          slug: string | null
          state: string | null
        }
        Insert: {
          access_code?: string | null
          address?: string | null
          admin_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          motto?: string | null
          name: string
          onboarding_complete?: boolean
          owner_user_id: string
          phone?: string | null
          slug?: string | null
          state?: string | null
        }
        Update: {
          access_code?: string | null
          address?: string | null
          admin_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          motto?: string | null
          name?: string
          onboarding_complete?: boolean
          owner_user_id?: string
          phone?: string | null
          slug?: string | null
          state?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          dark_mode: boolean
          grade_scale: Json | null
          id: string
          next_term_date: string | null
          report_font: string | null
          report_theme: string | null
          school_id: string
          session: string | null
          show_photo: boolean
          show_position: boolean
          term: string | null
        }
        Insert: {
          dark_mode?: boolean
          grade_scale?: Json | null
          id?: string
          next_term_date?: string | null
          report_font?: string | null
          report_theme?: string | null
          school_id: string
          session?: string | null
          show_photo?: boolean
          show_position?: boolean
          term?: string | null
        }
        Update: {
          dark_mode?: boolean
          grade_scale?: Json | null
          id?: string
          next_term_date?: string | null
          report_font?: string | null
          report_theme?: string | null
          school_id?: string
          session?: string | null
          show_photo?: boolean
          show_position?: boolean
          term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          admission_no: string | null
          class_id: string
          created_at: string
          first_name: string
          id: string
          last_name: string
          photo_url: string | null
          sex: string | null
        }
        Insert: {
          admission_no?: string | null
          class_id: string
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          photo_url?: string | null
          sex?: string | null
        }
        Update: {
          admission_no?: string | null
          class_id?: string
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          photo_url?: string | null
          sex?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          activated_date: string | null
          amount_kobo: number | null
          billing: string | null
          expiry_date: string | null
          id: string
          interval: string | null
          paystack_customer_code: string | null
          paystack_reference: string | null
          paystack_subscription_code: string | null
          plan: string
          school_id: string
          status: string
          trial_end: string | null
          trial_start: string | null
        }
        Insert: {
          activated_date?: string | null
          amount_kobo?: number | null
          billing?: string | null
          expiry_date?: string | null
          id?: string
          interval?: string | null
          paystack_customer_code?: string | null
          paystack_reference?: string | null
          paystack_subscription_code?: string | null
          plan?: string
          school_id: string
          status?: string
          trial_end?: string | null
          trial_start?: string | null
        }
        Update: {
          activated_date?: string | null
          amount_kobo?: number | null
          billing?: string | null
          expiry_date?: string | null
          id?: string
          interval?: string | null
          paystack_customer_code?: string | null
          paystack_reference?: string | null
          paystack_subscription_code?: string | null
          plan?: string
          school_id?: string
          status?: string
          trial_end?: string | null
          trial_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_sessions: {
        Row: {
          class_id: string
          created_at: string
          expires_at: string
          last_seen_at: string
          school_id: string
          token: string
        }
        Insert: {
          class_id: string
          created_at?: string
          expires_at?: string
          last_seen_at?: string
          school_id: string
          token: string
        }
        Update: {
          class_id?: string
          created_at?: string
          expires_at?: string
          last_seen_at?: string
          school_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_sessions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_sessions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      traits: {
        Row: {
          class_id: string
          id: string
          rating: number | null
          student_id: string
          trait: string
        }
        Insert: {
          class_id: string
          id?: string
          rating?: number | null
          student_id: string
          trait: string
        }
        Update: {
          class_id?: string
          id?: string
          rating?: number | null
          student_id?: string
          trait?: string
        }
        Relationships: [
          {
            foreignKeyName: "traits_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "traits_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hash_secret: { Args: { _plain: string }; Returns: string }
      is_class_school_owner: { Args: { _class_id: string }; Returns: boolean }
      is_class_teacher: { Args: { _class_id: string }; Returns: boolean }
      is_school_owner: { Args: { _school_id: string }; Returns: boolean }
      is_student_school_owner: {
        Args: { _student_id: string }
        Returns: boolean
      }
      is_student_teacher: { Args: { _student_id: string }; Returns: boolean }
      user_is_school_member: { Args: { _school_id: string }; Returns: boolean }
      verify_secret: {
        Args: { _hash: string; _plain: string }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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

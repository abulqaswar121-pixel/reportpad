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
      booking_slots: {
        Row: {
          active: boolean
          capacity: number
          created_at: string
          ends_at: string
          id: string
          product_id: string
          reserved_count: number
          starts_at: string
        }
        Insert: {
          active?: boolean
          capacity: number
          created_at?: string
          ends_at: string
          id?: string
          product_id: string
          reserved_count?: number
          starts_at: string
        }
        Update: {
          active?: boolean
          capacity?: number
          created_at?: string
          ends_at?: string
          id?: string
          product_id?: string
          reserved_count?: number
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_slots_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      cargo_profiles: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          destination_country: string
          id: string
          metric: string
          minimum_charge: number
          name: string
          origin_country: string
          rate: number
          transport_mode: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          destination_country: string
          id?: string
          metric: string
          minimum_charge?: number
          name: string
          origin_country?: string
          rate: number
          transport_mode: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          destination_country?: string
          id?: string
          metric?: string
          minimum_charge?: number
          name?: string
          origin_country?: string
          rate?: number
          transport_mode?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cargo_profiles_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
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
      exchange_rates: {
        Row: {
          currency: string
          ngn_per_unit: number
          updated_at: string
        }
        Insert: {
          currency: string
          ngn_per_unit: number
          updated_at?: string
        }
        Update: {
          currency?: string
          ngn_per_unit?: number
          updated_at?: string
        }
        Relationships: []
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
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          total_price: number | null
          unit_price: number
          variant_description: string | null
          variant_id: string | null
          weight_kg: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          total_price?: number | null
          unit_price: number
          variant_description?: string | null
          variant_id?: string | null
          weight_kg?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          total_price?: number | null
          unit_price?: number
          variant_description?: string | null
          variant_id?: string | null
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          checkout_token: string
          created_at: string
          currency: string
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_note: string | null
          customer_phone: string | null
          delivery_zone_id: string | null
          id: string
          metadata: Json
          order_number: number
          paid_at: string | null
          payment_processing_fee: number
          payment_provider:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          payment_reference: string | null
          platform_fee: number
          shipping_address: Json | null
          shipping_fee: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          checkout_token?: string
          created_at?: string
          currency?: string
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_note?: string | null
          customer_phone?: string | null
          delivery_zone_id?: string | null
          id?: string
          metadata?: Json
          order_number?: never
          paid_at?: string | null
          payment_processing_fee?: number
          payment_provider?:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          payment_reference?: string | null
          platform_fee?: number
          shipping_address?: Json | null
          shipping_fee?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          checkout_token?: string
          created_at?: string
          currency?: string
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_note?: string | null
          customer_phone?: string | null
          delivery_zone_id?: string | null
          id?: string
          metadata?: Json
          order_number?: never
          paid_at?: string | null
          payment_processing_fee?: number
          payment_provider?:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          payment_reference?: string | null
          platform_fee?: number
          shipping_address?: Json | null
          shipping_fee?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_zone_id_fkey"
            columns: ["delivery_zone_id"]
            isOneToOne: false
            referencedRelation: "shipping_zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_events: {
        Row: {
          event_type: string
          id: string
          order_id: string | null
          payload: Json
          processed: boolean
          processed_at: string | null
          processing_error: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_event_id: string
          received_at: string
        }
        Insert: {
          event_type: string
          id?: string
          order_id?: string | null
          payload: Json
          processed?: boolean
          processed_at?: string | null
          processing_error?: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_event_id: string
          received_at?: string
        }
        Update: {
          event_type?: string
          id?: string
          order_id?: string | null
          payload?: Json
          processed?: boolean
          processed_at?: string | null
          processing_error?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_event_id?: string
          received_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number
          bank_account_snapshot: Json
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          processed_at: string | null
          provider_reference: string | null
          requested_at: string
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
          vendor_id: string
        }
        Insert: {
          amount: number
          bank_account_snapshot: Json
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          processed_at?: string | null
          provider_reference?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
          vendor_id: string
        }
        Update: {
          amount?: number
          bank_account_snapshot?: Json
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          processed_at?: string | null
          provider_reference?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json
          created_at: string
          id: string
          price_modifier: number
          product_id: string
          sku: string | null
          stock_count: number
          updated_at: string
          variant_name: string
          variant_value: string
        }
        Insert: {
          attributes?: Json
          created_at?: string
          id?: string
          price_modifier?: number
          product_id: string
          sku?: string | null
          stock_count?: number
          updated_at?: string
          variant_name: string
          variant_value: string
        }
        Update: {
          attributes?: Json
          created_at?: string
          id?: string
          price_modifier?: number
          product_id?: string
          sku?: string | null
          stock_count?: number
          updated_at?: string
          variant_name?: string
          variant_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allocation_threshold: number | null
          base_price: number
          category: string
          compare_at_price: number | null
          created_at: string
          description: string
          digital_file_path: string | null
          id: string
          image_url: string
          image_urls: Json
          is_active: boolean
          is_featured: boolean
          metadata: Json
          name: string
          product_type: Database["public"]["Enums"]["product_type"]
          slug: string
          stock_count: number
          updated_at: string
          vendor_id: string
          volume_cbm: number
          weight_kg: number
        }
        Insert: {
          allocation_threshold?: number | null
          base_price: number
          category?: string
          compare_at_price?: number | null
          created_at?: string
          description?: string
          digital_file_path?: string | null
          id?: string
          image_url?: string
          image_urls?: Json
          is_active?: boolean
          is_featured?: boolean
          metadata?: Json
          name: string
          product_type?: Database["public"]["Enums"]["product_type"]
          slug: string
          stock_count?: number
          updated_at?: string
          vendor_id: string
          volume_cbm?: number
          weight_kg?: number
        }
        Update: {
          allocation_threshold?: number | null
          base_price?: number
          category?: string
          compare_at_price?: number | null
          created_at?: string
          description?: string
          digital_file_path?: string | null
          id?: string
          image_url?: string
          image_urls?: Json
          is_active?: boolean
          is_featured?: boolean
          metadata?: Json
          name?: string
          product_type?: Database["public"]["Enums"]["product_type"]
          slug?: string
          stock_count?: number
          updated_at?: string
          vendor_id?: string
          volume_cbm?: number
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string
          created_at: string
          customer_id: string | null
          customer_name: string
          id: string
          is_published: boolean
          is_verified: boolean
          order_id: string | null
          product_id: string
          rating: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          customer_id?: string | null
          customer_name: string
          id?: string
          is_published?: boolean
          is_verified?: boolean
          order_id?: string | null
          product_id: string
          rating: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          body?: string
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          id?: string
          is_published?: boolean
          is_verified?: boolean
          order_id?: string | null
          product_id?: string
          rating?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
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
      shipping_zones: {
        Row: {
          active: boolean
          country_code: string
          created_at: string
          estimated_days_max: number | null
          estimated_days_min: number | null
          fee: number
          id: string
          state: string
          updated_at: string
          vendor_id: string
          zone_name: string
        }
        Insert: {
          active?: boolean
          country_code?: string
          created_at?: string
          estimated_days_max?: number | null
          estimated_days_min?: number | null
          fee: number
          id?: string
          state: string
          updated_at?: string
          vendor_id: string
          zone_name: string
        }
        Update: {
          active?: boolean
          country_code?: string
          created_at?: string
          estimated_days_max?: number | null
          estimated_days_min?: number | null
          fee?: number
          id?: string
          state?: string
          updated_at?: string
          vendor_id?: string
          zone_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_zones_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
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
      subscription_events: {
        Row: {
          amount: number | null
          created_at: string
          event_type: string
          id: string
          payload: Json
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_reference: string
          vendor_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_reference: string
          vendor_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_reference?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_events_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
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
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string
          id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: Json
          billing_cycle: Database["public"]["Enums"]["billing_cycle"]
          business_category: Database["public"]["Enums"]["vendor_archetype"]
          business_description: string
          business_name: string
          created_at: string
          current_period_end: string
          default_currency: string
          design_settings: Json
          email: string
          id: string
          meta_capi_token_encrypted: string | null
          meta_pixel_id: string | null
          owner_user_id: string
          platform_fee_percentage: number
          published: boolean
          seo_description: string | null
          seo_title: string | null
          shop_slug: string
          social_links: Json
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          support_email: string | null
          timezone: string
          trial_end_date: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          address?: Json
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          business_category: Database["public"]["Enums"]["vendor_archetype"]
          business_description?: string
          business_name: string
          created_at?: string
          current_period_end?: string
          default_currency?: string
          design_settings?: Json
          email: string
          id?: string
          meta_capi_token_encrypted?: string | null
          meta_pixel_id?: string | null
          owner_user_id: string
          platform_fee_percentage?: number
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          shop_slug: string
          social_links?: Json
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          support_email?: string | null
          timezone?: string
          trial_end_date?: string
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          address?: Json
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          business_category?: Database["public"]["Enums"]["vendor_archetype"]
          business_description?: string
          business_name?: string
          created_at?: string
          current_period_end?: string
          default_currency?: string
          design_settings?: Json
          email?: string
          id?: string
          meta_capi_token_encrypted?: string | null
          meta_pixel_id?: string | null
          owner_user_id?: string
          platform_fee_percentage?: number
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          shop_slug?: string
          social_links?: Json
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          support_email?: string | null
          timezone?: string
          trial_end_date?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_storefront_order: {
        Args: {
          customer: Json
          destination: Json
          requested_checkout_token: string
          requested_items: Json
          requested_provider: Database["public"]["Enums"]["payment_provider"]
          requested_vendor_slug: string
          requested_zone_id: string
        }
        Returns: Json
      }
      has_role: {
        Args: {
          requested_role: Database["public"]["Enums"]["app_role"]
          requested_user_id: string
        }
        Returns: boolean
      }
      hash_secret: { Args: { _plain: string }; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_class_school_owner: { Args: { _class_id: string }; Returns: boolean }
      is_class_teacher: { Args: { _class_id: string }; Returns: boolean }
      is_school_owner: { Args: { _school_id: string }; Returns: boolean }
      is_student_school_owner: {
        Args: { _student_id: string }
        Returns: boolean
      }
      is_student_teacher: { Args: { _student_id: string }; Returns: boolean }
      mark_order_paid: {
        Args: {
          paid_payload: Json
          provider_reference: string
          target_order_id: string
        }
        Returns: boolean
      }
      replace_product_variants: {
        Args: { target_product_id: string; variants: Json }
        Returns: undefined
      }
      user_is_school_member: { Args: { _school_id: string }; Returns: boolean }
      verify_secret: {
        Args: { _hash: string; _plain: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "vendor" | "customer"
      billing_cycle: "monthly" | "yearly"
      order_status:
        | "pending"
        | "awaiting_payment"
        | "paid"
        | "processing"
        | "fulfilled"
        | "cancelled"
        | "refunded"
      payment_provider:
        | "paystack"
        | "flutterwave"
        | "stripe"
        | "bank_transfer"
        | "whatsapp"
      payout_status:
        | "requested"
        | "processing"
        | "paid"
        | "failed"
        | "cancelled"
      product_type: "physical" | "booking" | "service" | "digital"
      subscription_status: "trial" | "active" | "past_due" | "expired"
      subscription_tier: "starter" | "pro" | "global_enterprise"
      vendor_archetype:
        | "wigs_fashion"
        | "marketplace"
        | "grocery_food"
        | "wholesale_pod"
        | "cargo_logistics"
        | "travel_tours"
        | "freelance_services"
        | "event_ticketing"
        | "digital_products"
        | "rentals_subscriptions"
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
    Enums: {
      app_role: ["admin", "vendor", "customer"],
      billing_cycle: ["monthly", "yearly"],
      order_status: [
        "pending",
        "awaiting_payment",
        "paid",
        "processing",
        "fulfilled",
        "cancelled",
        "refunded",
      ],
      payment_provider: [
        "paystack",
        "flutterwave",
        "stripe",
        "bank_transfer",
        "whatsapp",
      ],
      payout_status: ["requested", "processing", "paid", "failed", "cancelled"],
      product_type: ["physical", "booking", "service", "digital"],
      subscription_status: ["trial", "active", "past_due", "expired"],
      subscription_tier: ["starter", "pro", "global_enterprise"],
      vendor_archetype: [
        "wigs_fashion",
        "marketplace",
        "grocery_food",
        "wholesale_pod",
        "cargo_logistics",
        "travel_tours",
        "freelance_services",
        "event_ticketing",
        "digital_products",
        "rentals_subscriptions",
      ],
    },
  },
} as const

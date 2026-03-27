export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          city: string | null
          district: string | null
          parenting_style: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          city?: string | null
          district?: string | null
          parenting_style?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          city?: string | null
          district?: string | null
          parenting_style?: string[] | null
          updated_at?: string
        }
      }
      families: {
        Row: {
          id: string
          name: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          name?: string | null
        }
      }
      family_members: {
        Row: {
          id: string
          family_id: string
          user_id: string | null
          role: string
          permissions: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id?: string | null
          role?: string
          permissions?: string | null
          joined_at?: string
        }
        Update: {
          role?: string
          permissions?: string | null
        }
      }
      children: {
        Row: {
          id: string
          family_id: string
          nickname: string
          birth_date: string
          gender: string | null
          birth_weight_g: number | null
          birth_height_cm: number | null
          gestational_weeks: number | null
          allergies: string[]
          health_conditions: string[]
          special_traits: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          nickname: string
          birth_date: string
          gender?: string | null
          birth_weight_g?: number | null
          birth_height_cm?: number | null
          gestational_weeks?: number | null
          allergies?: string[]
          health_conditions?: string[]
          special_traits?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          nickname?: string
          birth_date?: string
          gender?: string | null
          birth_weight_g?: number | null
          birth_height_cm?: number | null
          gestational_weeks?: number | null
          allergies?: string[]
          health_conditions?: string[]
          special_traits?: string[]
          updated_at?: string
        }
      }
      growth_records: {
        Row: {
          id: string
          child_id: string
          recorded_by: string | null
          measured_at: string
          height_cm: number | null
          weight_kg: number | null
          head_circumference_cm: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          recorded_by?: string | null
          measured_at: string
          height_cm?: number | null
          weight_kg?: number | null
          head_circumference_cm?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          height_cm?: number | null
          weight_kg?: number | null
          head_circumference_cm?: number | null
          notes?: string | null
        }
      }
      places: {
        Row: {
          id: string
          name: string
          city: string | null
          district: string | null
          address: string | null
          lat: number | null
          lng: number | null
          place_type: string[] | null
          suitable_age_min: number
          suitable_age_max: number
          is_indoor: boolean
          mosquito_risk_level: number
          features: string[]
          opening_hours: Json | null
          avg_stay_minutes: number | null
          avg_rating: number
          review_count: number
          image_url: string | null
          description: string | null
          is_trending: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          city?: string | null
          district?: string | null
          address?: string | null
          lat?: number | null
          lng?: number | null
          place_type?: string[] | null
          suitable_age_min?: number
          suitable_age_max?: number
          is_indoor?: boolean
          mosquito_risk_level?: number
          features?: string[]
          opening_hours?: Json | null
          avg_stay_minutes?: number | null
          avg_rating?: number
          review_count?: number
          image_url?: string | null
          description?: string | null
          is_trending?: boolean
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['places']['Insert']>
      }
      kindergartens: {
        Row: {
          id: string
          name: string
          city: string | null
          district: string | null
          address: string | null
          lat: number | null
          lng: number | null
          phone: string | null
          website: string | null
          type: string | null
          teaching_method: string[] | null
          student_teacher_ratio: number | null
          capacity: number | null
          monthly_fee: number | null
          registration_fee: number | null
          extended_care_fee: number | null
          material_fee: number | null
          inspection_records: Json | null
          violation_records: Json | null
          staff_turnover_rate: number | null
          features: Json | null
          description: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          city?: string | null
          district?: string | null
          address?: string | null
          lat?: number | null
          lng?: number | null
          phone?: string | null
          website?: string | null
          type?: string | null
          teaching_method?: string[] | null
          student_teacher_ratio?: number | null
          capacity?: number | null
          monthly_fee?: number | null
          registration_fee?: number | null
          extended_care_fee?: number | null
          material_fee?: number | null
          inspection_records?: Json | null
          violation_records?: Json | null
          staff_turnover_rate?: number | null
          features?: Json | null
          description?: string | null
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['kindergartens']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// 便利型別
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Child = Database['public']['Tables']['children']['Row']
export type GrowthRecord = Database['public']['Tables']['growth_records']['Row']
export type Place = Database['public']['Tables']['places']['Row']
export type Kindergarten = Database['public']['Tables']['kindergartens']['Row']

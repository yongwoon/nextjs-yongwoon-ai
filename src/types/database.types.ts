// Generated types from Supabase database schema
// This file will be auto-generated using: supabase gen types typescript --local

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Users table (extends Supabase auth.users)
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // Conversations table
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      // Messages table
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: "user" | "assistant" | "system";
          content?: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };

      // Documents table
      documents: {
        Row: {
          id: string;
          user_id: string;
          filename: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          processed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          filename: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          processed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          filename?: string;
          file_path?: string;
          file_size?: number;
          mime_type?: string;
          processed?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      // Auth tokens table (for Magic Link authentication)
      auth_tokens: {
        Row: {
          id: string;
          email: string;
          token_hash: string;
          token_type: "magic_link" | "verification_code";
          expires_at: string;
          used_at: string | null;
          user_agent: string | null;
          ip_address: string | null;
          browser_fingerprint: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          token_hash: string;
          token_type: "magic_link" | "verification_code";
          expires_at: string;
          used_at?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          browser_fingerprint?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          token_hash?: string;
          token_type?: "magic_link" | "verification_code";
          expires_at?: string;
          used_at?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          browser_fingerprint?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };

      // Verification codes table
      verification_codes: {
        Row: {
          id: string;
          email: string;
          code: string;
          expires_at: string;
          used_at: string | null;
          auth_token_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          code: string;
          expires_at: string;
          used_at?: string | null;
          auth_token_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          code?: string;
          expires_at?: string;
          used_at?: string | null;
          auth_token_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "verification_codes_auth_token_id_fkey";
            columns: ["auth_token_id"];
            referencedRelation: "auth_tokens";
            referencedColumns: ["id"];
          },
        ];
      };

      // Browser sessions table
      browser_sessions: {
        Row: {
          id: string;
          email: string;
          browser_fingerprint: string;
          user_agent: string;
          ip_address: string | null;
          is_trusted: boolean;
          last_activity: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          browser_fingerprint: string;
          user_agent: string;
          ip_address?: string | null;
          is_trusted?: boolean;
          last_activity?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          browser_fingerprint?: string;
          user_agent?: string;
          ip_address?: string | null;
          is_trusted?: boolean;
          last_activity?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      // Custom functions will be added here
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

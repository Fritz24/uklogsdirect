import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ data: any | null; error: any | null }>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdminStatus = async (userId: string | undefined) => {
    console.log('checkAdminStatus called with userId:', userId); // Debug log
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    try {
      console.log('Attempting to query profiles table for role...'); // New debug log

      let data: { role: string } | null = null;
      let error: any = null; // Can be PostgrestError or generic Error

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single({ signal: controller.signal }); // Pass the abort signal

        data = profileData;
        error = profileError;

      } catch (e: any) {
        // This catch block handles both Supabase errors and AbortError from timeout
        console.error('Supabase query execution error or timeout in checkAdminStatus:', e);
        error = e;
      } finally {
        window.clearTimeout(timeoutId); // Explicitly use window.clearTimeout to resolve linter error
      }

      console.log('Supabase profiles query result:', { data, error });

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          console.warn('Profile not found for user ID:', userId, '- Not an admin.');
          setIsAdmin(false);
        } else if (error.name === 'AbortError') { // Handle explicit timeout
          console.error('Supabase profiles query timed out.');
          setIsAdmin(false);
        }
        else {
          console.error('Error fetching user role from profiles (after query):', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(data?.role === 'admin');
        console.log('isAdmin set to:', data?.role === 'admin');
      }
    } catch (error) {
      console.error('Caught unexpected error in checkAdminStatus (outer catch):', error);
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    const handleAuthChange = async (event: string, session: any | null) => {
      console.log('Auth state changed:', event, session); // Debug log
      setUser(session?.user ?? null)
      await checkAdminStatus(session?.user?.id);
      setLoading(false)
    }

    // Get initial session and listen for auth changes
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session:', session); // Debug log
      setUser(session?.user ?? null)
      await checkAdminStatus(session?.user?.id);
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      handleAuthChange
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error); // Debug log
      throw error
    }
    // Explicitly clear user and admin status after successful sign out
    setUser(null);
    setIsAdmin(false);
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
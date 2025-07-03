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
      // Assuming you have a 'profiles' table with a 'role' column and 'id' matching auth.users.id
      let data, error;
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase profiles query timed out after 10 seconds')), 10000)
      );

      try {
        ({ data, error } = await Promise.race([
          supabase.from('profiles').select('role').eq('id', userId).single(),
          timeout
        ]));
      } catch (e) {
        console.error('Supabase query execution error in checkAdminStatus:', e); // Log direct execution errors
        error = e; // Assign the caught error to the error variable
      }

      console.log('Supabase profiles query result:', { data, error }); // Existing debug log

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          console.warn('Profile not found for user ID:', userId, '- Not an admin.');
          setIsAdmin(false);
        } else {
          console.error('Error fetching user role from profiles (after query):', error); // More specific log
          setIsAdmin(false); // Ensure isAdmin is false on any error
        }
      } else {
        setIsAdmin(data?.role === 'admin');
        console.log('isAdmin set to:', data?.role === 'admin');
      }
    } catch (error) {
      console.error('Caught unexpected error in checkAdminStatus:', error);
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
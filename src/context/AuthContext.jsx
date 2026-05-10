import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [profile, setProfile]         = useState(null)
  const [profileLoaded, setProfileLoaded] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch role flags + avatar whenever the authed user changes
  useEffect(() => {
    if (!user?.id) {
      setProfile(null)
      setProfileLoaded(true)
      return
    }
    setProfileLoaded(false)
    supabase
      .from('profiles')
      .select('is_admin, is_owner, is_coach, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setProfile(data ?? {})
        setProfileLoaded(true)
      })
  }, [user?.id])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password, fullName) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

  const signOut = () => supabase.auth.signOut()

  if (loading) return null

  return (
    <AuthContext.Provider value={{ user, profile, profileLoaded, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

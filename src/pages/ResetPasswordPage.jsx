import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const INPUT_CLS =
  'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none ' +
  'focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  // 'waiting' → Supabase is processing the URL token
  // 'ready'   → PASSWORD_RECOVERY event fired, session active
  // 'done'    → password saved
  const [state, setState]       = useState('waiting')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    // Supabase processes the #access_token from the URL hash automatically.
    // It fires PASSWORD_RECOVERY when the token is valid and a session is set.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setState('ready')
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setState('done')
      // Brief pause so the user sees the confirmation, then go to dashboard
      setTimeout(() => navigate('/dashboard'), 2000)
    }
  }

  // ── Waiting for token ──────────────────────────────────────────────
  if (state === 'waiting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center space-y-3">
          <Loader2 size={24} className="text-slate-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Verifying reset link…</p>
          <p className="text-xs text-slate-400">
            If nothing happens,{' '}
            <Link to="/forgot-password" className="underline hover:text-slate-700">
              request a new link
            </Link>
            .
          </p>
        </div>
      </div>
    )
  }

  // ── Done ──────────────────────────────────────────────────────────
  if (state === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center max-w-sm w-full space-y-2">
          <p className="text-sm font-semibold text-slate-900">Password updated</p>
          <p className="text-sm text-slate-500">Taking you to your dashboard…</p>
        </div>
      </div>
    )
  }

  // ── Ready: show form ──────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-2xl font-semibold tracking-tight text-slate-900">Alan Studio</p>
          <p className="text-sm text-slate-500 mt-1">Choose a new password</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4"
        >
          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="pw" className="block text-sm font-medium text-slate-700 mb-1.5">
              New password
            </label>
            <input
              id="pw"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 mb-1.5">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat new password"
              className={INPUT_CLS}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {loading ? 'Saving…' : 'Set new password'}
          </button>
        </form>
      </div>
    </div>
  )
}

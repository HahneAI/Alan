import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone } from 'lucide-react'
import { supabase } from '../lib/supabase'

const INPUT_CLS =
  'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none ' +
  'focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'

const BTN_CLS =
  'w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium ' +
  'hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150'

// Ensure phone has a leading +
function normalizePhone(raw) {
  const digits = raw.replace(/\s/g, '')
  return digits.startsWith('+') ? digits : `+${digits}`
}

// ── Step components ───────────────────────────────────────────────

function MethodPicker({ method, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
      {[
        { value: 'email', icon: Mail,  label: 'Email'  },
        { value: 'phone', icon: Phone, label: 'Phone'  },
      ].map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
            method === value
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Icon size={14} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const [method, setMethod]   = useState('email')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  // phone flow keeps the normalized number for subsequent steps
  const [pending, setPending] = useState('')
  const [otp, setOtp]         = useState('')
  const [newPw, setNewPw]     = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  // 'input' | 'email-sent' | 'phone-code' | 'phone-reset' | 'done'
  const [step, setStep]     = useState('input')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  // ── Step 1: send reset / OTP ──────────────────────────────────────
  const handleSend = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (method === 'email') {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) setError(error.message)
      else setStep('email-sent')
    } else {
      const normalized = normalizePhone(phone)
      const { error } = await supabase.auth.signInWithOtp({ phone: normalized })
      if (error) setError(error.message)
      else {
        setPending(normalized)
        setStep('phone-code')
      }
    }
    setLoading(false)
  }

  // ── Step 2 (phone): verify OTP → creates session ──────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      phone: pending,
      token: otp.trim(),
      type: 'sms',
    })

    if (error) setError(error.message)
    else setStep('phone-reset')
    setLoading(false)
  }

  // ── Step 3 (phone): set new password (session already active) ─────
  const handleSetPassword = async (e) => {
    e.preventDefault()
    setError(null)

    if (newPw.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (newPw !== confirmPw) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) setError(error.message)
    else setStep('done')
    setLoading(false)
  }

  // ── Shared shell ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-2xl font-semibold tracking-tight text-slate-900">Alan Studio</p>
          <p className="text-sm text-slate-500 mt-1">Reset your password</p>
        </div>

        {/* ── email sent ── */}
        {step === 'email-sent' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Mail size={18} className="text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900">Check your inbox</p>
            <p className="text-sm text-slate-500">
              We sent a reset link to <span className="font-medium text-slate-700">{email}</span>.
              The link expires in 1 hour.
            </p>
            <button
              type="button"
              onClick={() => { setStep('input'); setError(null) }}
              className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-2"
            >
              Try a different address
            </button>
          </div>
        )}

        {/* ── done ── */}
        {step === 'done' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-900">Password updated</p>
            <p className="text-sm text-slate-500">Your new password is active. You&apos;re now signed in.</p>
            <Link to="/dashboard" className="block text-sm font-medium text-slate-900 hover:underline">
              Go to dashboard →
            </Link>
          </div>
        )}

        {/* ── input step ── */}
        {step === 'input' && (
          <form onSubmit={handleSend} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
            <MethodPicker method={method} onChange={(m) => { setMethod(m); setError(null) }} />

            {error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {method === 'email' ? (
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={INPUT_CLS}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="reset-phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone number
                </label>
                <input
                  id="reset-phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 000 0000"
                  className={INPUT_CLS}
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  Must match the verified phone on your account.
                </p>
              </div>
            )}

            <button type="submit" disabled={loading} className={BTN_CLS}>
              {loading
                ? 'Sending…'
                : method === 'email' ? 'Send reset link' : 'Send code'
              }
            </button>
          </form>
        )}

        {/* ── phone: enter OTP code ── */}
        {step === 'phone-code' && (
          <form onSubmit={handleVerifyOtp} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-slate-900">Enter the code we texted you</p>
              <p className="text-xs text-slate-400">Sent to {pending}</p>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1.5">
                6-digit code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className={`${INPUT_CLS} tracking-widest text-center text-lg font-mono`}
              />
            </div>

            <button type="submit" disabled={loading || otp.length < 6} className={BTN_CLS}>
              {loading ? 'Verifying…' : 'Verify code'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('input'); setOtp(''); setError(null) }}
              className="w-full text-xs text-slate-400 hover:text-slate-600"
            >
              Try a different number
            </button>
          </form>
        )}

        {/* ── phone: set new password ── */}
        {step === 'phone-reset' && (
          <form onSubmit={handleSetPassword} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
            <p className="text-sm font-semibold text-slate-900 text-center">Set a new password</p>

            {error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="new-pw" className="block text-sm font-medium text-slate-700 mb-1.5">
                New password
              </label>
              <input
                id="new-pw"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min. 6 characters"
                className={INPUT_CLS}
              />
            </div>

            <div>
              <label htmlFor="confirm-pw" className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm password
              </label>
              <input
                id="confirm-pw"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                className={INPUT_CLS}
              />
            </div>

            <button type="submit" disabled={loading} className={BTN_CLS}>
              {loading ? 'Saving…' : 'Set new password'}
            </button>
          </form>
        )}

        {/* Back to login */}
        {!['email-sent', 'done'].includes(step) && (
          <div className="mt-5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Camera, Check, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

// ── Shared primitives ─────────────────────────────────────────────

const INPUT_CLS =
  'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none ' +
  'focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'

function Field({ id, label, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

function Banner({ status }) {
  if (!status) return null
  const isError = status.type === 'error'
  return (
    <div
      role="alert"
      className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2.5 ${
        isError
          ? 'bg-red-50 border border-red-100 text-red-600'
          : 'bg-emerald-50 border border-emerald-100 text-emerald-700'
      }`}
    >
      {isError
        ? <AlertCircle size={15} className="shrink-0" />
        : <Check size={15} className="shrink-0" />
      }
      {status.message}
    </div>
  )
}

function CardShell({ title, children }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function SaveRow({ loading, disabled, label = 'Save changes', note }) {
  return (
    <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
      {note && <p className="text-xs text-slate-400 hidden sm:block">{note}</p>}
      <button
        type="submit"
        disabled={loading || disabled}
        className="ml-auto px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : label}
      </button>
    </div>
  )
}

// ── Avatar button ─────────────────────────────────────────────────

function AvatarButton({ url, initials, uploading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={uploading}
      aria-label="Change profile photo"
      className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 group"
    >
      {url ? (
        <img src={url} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xl font-semibold text-slate-600 select-none">
          {initials}
        </div>
      )}
      <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150">
        {uploading
          ? <Loader2 size={18} className="text-white animate-spin" />
          : <Camera size={18} className="text-white" />
        }
      </div>
    </button>
  )
}

// ── Card 1: Profile (avatar + display name) ───────────────────────

function ProfileCard({ user, profileLoading }) {
  const [fullName, setFullName]   = useState(user?.user_metadata?.full_name ?? '')
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus]       = useState(null)
  const fileInputRef = useRef(null)

  // Populate from DB on mount
  useEffect(() => {
    if (!profileLoading) return
    // profileLoading being true means we haven't loaded yet;
    // the parent passes initial values via props after its own fetch.
  }, [])

  // Receive initial data from parent once the profile fetch completes
  useEffect(() => {
    if (user?.user_metadata?.full_name) setFullName(user.user_metadata.full_name)
  }, [user])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Please select an image file.' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'Image must be smaller than 5 MB.' })
      return
    }

    setUploading(true)
    setStatus(null)

    const ext  = file.name.split('.').pop().toLowerCase()
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setStatus({ type: 'error', message: uploadError.message })
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    const displayUrl = `${publicUrl}?t=${Date.now()}`

    const { error: dbError } = await supabase
      .from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)

    if (dbError) setStatus({ type: 'error', message: dbError.message })
    else { setAvatarUrl(displayUrl); setStatus({ type: 'success', message: 'Photo updated.' }) }

    setUploading(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    const name = fullName.trim()

    const { error: dbErr } = await supabase
      .from('profiles').update({ full_name: name }).eq('id', user.id)
    if (dbErr) { setStatus({ type: 'error', message: dbErr.message }); setSaving(false); return }

    // Sync to auth metadata so sidebar re-renders via onAuthStateChange
    const { error: authErr } = await supabase.auth.updateUser({ data: { full_name: name } })
    if (authErr) setStatus({ type: 'error', message: authErr.message })
    else setStatus({ type: 'success', message: 'Profile saved.' })

    setSaving(false)
  }

  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <CardShell title="Profile">
      <form onSubmit={handleSave}>
        <div className="px-6 py-5 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            {profileLoading ? (
              <div className="w-20 h-20 rounded-full bg-slate-100 animate-pulse shrink-0" />
            ) : (
              <AvatarButton
                url={avatarUrl}
                initials={initials}
                uploading={uploading}
                onClick={() => fileInputRef.current?.click()}
              />
            )}
            <div>
              <p className="text-sm font-medium text-slate-900">Profile photo</p>
              <p className="text-xs text-slate-400 mt-0.5">JPG, PNG or GIF · max 5 MB</p>
              <button
                type="button"
                disabled={uploading || profileLoading}
                onClick={() => fileInputRef.current?.click()}
                className="mt-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-2 disabled:opacity-40 transition-colors"
              >
                {uploading ? 'Uploading…' : 'Change photo'}
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
          </div>

          <Field id="full-name" label="Display name">
            <input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              disabled={profileLoading}
              className={INPUT_CLS}
            />
          </Field>

          <Banner status={status} />
        </div>
        <SaveRow loading={saving} disabled={profileLoading} />
      </form>
    </CardShell>
  )
}

// ── Card 2: Phone number with OTP verification ────────────────────

function PhoneCard({ user, initialPhone, profileLoading }) {
  // 'idle' → 'sending' → 'verify' → 'saving' → back to 'idle'
  const [phoneStep, setPhoneStep] = useState('idle')
  const [phoneInput, setPhoneInput] = useState('')
  const [pending, setPending]     = useState('')  // normalized number being verified
  const [otp, setOtp]             = useState('')
  const [busy, setBusy]           = useState(false)
  const [status, setStatus]       = useState(null)

  // Show current phone once loaded
  const [currentPhone, setCurrentPhone] = useState('')
  useEffect(() => { if (initialPhone) setCurrentPhone(initialPhone) }, [initialPhone])

  const normalize = (raw) => {
    const d = raw.replace(/\s/g, '')
    return d.startsWith('+') ? d : `+${d}`
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    setStatus(null)
    setBusy(true)

    const normalized = normalize(phoneInput)
    // updateUser({ phone }) sends an OTP and stages the change in auth.users
    const { error } = await supabase.auth.updateUser({ phone: normalized })

    if (error) {
      setStatus({ type: 'error', message: error.message })
    } else {
      setPending(normalized)
      setPhoneStep('verify')
      setStatus({ type: 'success', message: `Code sent to ${normalized}` })
    }
    setBusy(false)
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setStatus(null)
    setBusy(true)

    const { error } = await supabase.auth.verifyOtp({
      phone: pending,
      token: otp.trim(),
      type: 'phone_change',
    })

    if (error) {
      setStatus({ type: 'error', message: error.message })
      setBusy(false)
      return
    }

    // Also persist in our profiles table
    await supabase.from('profiles').update({ phone: pending }).eq('id', user.id)

    setCurrentPhone(pending)
    setPhoneInput('')
    setOtp('')
    setPending('')
    setPhoneStep('idle')
    setStatus({ type: 'success', message: 'Phone number verified and saved.' })
    setBusy(false)
  }

  return (
    <CardShell title="Phone number">
      <div className="px-6 py-5 space-y-4">
        {currentPhone && phoneStep === 'idle' && (
          <p className="text-sm text-slate-600">
            Current: <span className="font-medium text-slate-900">{currentPhone}</span>
          </p>
        )}

        {phoneStep === 'idle' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <Field
              id="new-phone"
              label={currentPhone ? 'New phone number' : 'Phone number'}
              hint="Must include country code, e.g. +1 555 000 0000. Used for account recovery and instructor contact."
            >
              <input
                id="new-phone"
                type="tel"
                autoComplete="tel"
                required
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+1 555 000 0000"
                disabled={profileLoading}
                className={INPUT_CLS}
              />
            </Field>
            <Banner status={status} />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={busy || profileLoading || !phoneInput.trim()}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                {busy ? 'Sending…' : 'Send verification code'}
              </button>
            </div>
          </form>
        )}

        {phoneStep === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-slate-600">
              Enter the 6-digit code sent to <span className="font-medium">{pending}</span>.
            </p>
            <Field id="phone-otp" label="Verification code">
              <input
                id="phone-otp"
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
            </Field>
            <Banner status={status} />
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => { setPhoneStep('idle'); setOtp(''); setStatus(null) }}
                className="text-sm text-slate-500 hover:text-slate-900"
              >
                ← Change number
              </button>
              <button
                type="submit"
                disabled={busy || otp.length < 6}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                {busy ? 'Verifying…' : 'Verify'}
              </button>
            </div>
          </form>
        )}
      </div>
    </CardShell>
  )
}

// ── Card 3: Change password ───────────────────────────────────────

function PasswordCard({ user }) {
  const [current, setCurrent]   = useState('')
  const [newPw, setNewPw]       = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [saving, setSaving]     = useState(false)
  const [status, setStatus]     = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    if (newPw.length < 6) {
      setStatus({ type: 'error', message: 'New password must be at least 6 characters.' })
      return
    }
    if (newPw !== confirmPw) {
      setStatus({ type: 'error', message: 'New passwords do not match.' })
      return
    }

    setSaving(true)

    // Re-authenticate to verify current password before allowing change
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    })

    if (authErr) {
      setStatus({ type: 'error', message: 'Current password is incorrect.' })
      setSaving(false)
      return
    }

    const { error: updateErr } = await supabase.auth.updateUser({ password: newPw })

    if (updateErr) {
      setStatus({ type: 'error', message: updateErr.message })
    } else {
      setStatus({ type: 'success', message: 'Password updated.' })
      setCurrent('')
      setNewPw('')
      setConfirmPw('')
    }

    setSaving(false)
  }

  return (
    <CardShell title="Password">
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 space-y-4">
          <Field id="current-pw" label="Current password">
            <input
              id="current-pw"
              type="password"
              autoComplete="current-password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Your current password"
              className={INPUT_CLS}
            />
          </Field>

          <Field id="new-pw" label="New password">
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
          </Field>

          <Field id="confirm-pw" label="Confirm new password">
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
          </Field>

          <Banner status={status} />
        </div>
        <SaveRow loading={saving} label="Update password" note="Email changes require contacting an admin." />
      </form>
    </CardShell>
  )
}

// ── Page root ─────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user } = useAuth()
  const [profileLoading, setProfileLoading] = useState(true)
  const [initialPhone, setInitialPhone]     = useState('')

  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('profiles')
      .select('phone, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.phone) setInitialPhone(data.phone)
      })
      .finally(() => setProfileLoading(false))
  }, [user?.id])

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-1.5">Manage your profile, phone, and security.</p>
      </div>

      <ProfileCard user={user} profileLoading={profileLoading} />
      <PhoneCard   user={user} initialPhone={initialPhone} profileLoading={profileLoading} />
      <PasswordCard user={user} />
    </div>
  )
}

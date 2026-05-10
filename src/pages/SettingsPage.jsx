import { useState, useEffect, useRef } from 'react'
import { Camera, Check, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

// ── Sub-components ────────────────────────────────────────────────

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

function Field({ id, label, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

function StatusBanner({ status }) {
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

// ── Page ──────────────────────────────────────────────────────────

const INPUT_CLS =
  'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none ' +
  'focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'

export default function SettingsPage() {
  const { user } = useAuth()

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? '')
  const [phone, setPhone]       = useState('')
  const [avatarUrl, setAvatarUrl] = useState(null)

  const [profileLoading, setProfileLoading] = useState(true)
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus]     = useState(null)

  const fileInputRef = useRef(null)

  // Load existing profile data (phone + avatar aren't in auth metadata)
  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('profiles')
      .select('full_name, phone, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (!data) return
        if (data.full_name) setFullName(data.full_name)
        if (data.phone)     setPhone(data.phone)
        if (data.avatar_url) setAvatarUrl(data.avatar_url)
      })
      .finally(() => setProfileLoading(false))
  }, [user?.id])

  // ── Avatar upload ────────────────────────────────────────────────

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    // Reset input so the same file can be re-selected after an error
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

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    // Cache-bust so the browser doesn't serve the old image
    const displayUrl = `${publicUrl}?t=${Date.now()}`

    const { error: dbError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (dbError) {
      setStatus({ type: 'error', message: dbError.message })
    } else {
      setAvatarUrl(displayUrl)
      setStatus({ type: 'success', message: 'Profile photo updated.' })
    }

    setUploading(false)
  }

  // ── Profile save ─────────────────────────────────────────────────

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)

    const trimmedName  = fullName.trim()
    const trimmedPhone = phone.trim() || null

    const { error: dbError } = await supabase
      .from('profiles')
      .update({ full_name: trimmedName, phone: trimmedPhone })
      .eq('id', user.id)

    if (dbError) {
      setStatus({ type: 'error', message: dbError.message })
      setSaving(false)
      return
    }

    // Sync name back to auth metadata so the sidebar refreshes via onAuthStateChange
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: trimmedName },
    })

    if (authError) {
      setStatus({ type: 'error', message: authError.message })
    } else {
      setStatus({ type: 'success', message: 'Changes saved.' })
    }

    setSaving(false)
  }

  // ── Derived ───────────────────────────────────────────────────────

  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?'

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your profile and account preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Profile</h3>
        </div>

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

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </div>

          {/* Display name */}
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

          {/* Phone */}
          <Field
            id="phone"
            label="Phone number"
            hint="Used only by instructors — not shown publicly."
          >
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              disabled={profileLoading}
              className={INPUT_CLS}
            />
          </Field>

          <StatusBanner status={status} />
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400 hidden sm:block">
            Email changes are not supported here — contact an admin.
          </p>
          <button
            type="submit"
            disabled={saving || profileLoading}
            className="ml-auto px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

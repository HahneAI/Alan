# Phone Auth & Password Reset Setup

Everything needed to fully activate SMS-based password reset and phone
verification. The code is already written and gated behind a "coming soon"
notice — follow the steps below, then flip the one-line flag described at
the end to bring it live.

---

## 1. Create a Twilio account

1. Sign up at <https://www.twilio.com/try-twilio> (free trial includes a real
   phone number and SMS credits).
2. From the Twilio Console dashboard, note your:
   - **Account SID** — looks like `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Auth Token** — shown below the Account SID (click the eye icon)

### Create a Messaging Service

A Messaging Service gives you a stable sender identity and handles number
pools as you scale.

1. In the Twilio Console go to **Messaging → Services → Create Messaging Service**.
2. Give it a name (e.g. "Alan Studio").
3. Add a sender — use the free trial number Twilio provisioned for your account
   (**Phone Numbers → Manage → Active numbers**, then add it to the service).
4. Copy the **Messaging Service SID** — looks like `MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

> **Trial account limit:** Twilio trial accounts can only send SMS to verified
> numbers. Add any test phone numbers under **Phone Numbers → Verified Caller IDs**
> before going live. Upgrade to a paid account to lift this restriction.

---

## 2. Configure Supabase — Phone provider

1. Open your Supabase project dashboard.
2. Go to **Authentication → Providers → Phone**.
3. Toggle **Phone** to **Enabled**.
4. Fill in:

   | Field | Value |
   |-------|-------|
   | SMS Provider | Twilio |
   | Account SID | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
   | Auth Token | *(from Twilio Console)* |
   | Message Service SID | `MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |

5. Leave **OTP Expiry** at `600` (10 minutes) unless you want it shorter.
6. Click **Save**.

> Supabase also supports Vonage, MessageBird, and Textlocal if you prefer a
> different SMS provider. The fields differ slightly; Supabase's dashboard
> shows the correct fields once you select the provider.

---

## 3. Configure Supabase — Redirect URLs (email reset)

Email-based password reset links redirect the user back to your app. The
destination URL must be whitelisted.

1. Go to **Authentication → URL Configuration**.
2. Under **Redirect URLs**, add:
   ```
   https://yourdomain.com/reset-password
   ```
3. For local development also add:
   ```
   http://localhost:5173/reset-password
   ```
4. Click **Save**.

The `resetPasswordForEmail` call in `ForgotPasswordPage.jsx` already passes
`redirectTo: window.location.origin + '/reset-password'`, so no code change
is needed here.

---

## 4. How the phone OTP flows work (reference)

### Forgot password via phone (`ForgotPasswordPage.jsx`)

```
User enters phone
       ↓
supabase.auth.signInWithOtp({ phone })   ← Twilio sends 6-digit SMS
       ↓
User enters code
       ↓
supabase.auth.verifyOtp({ phone, token, type: 'sms' })
       ↓
Session is now active (user is signed in)
       ↓
supabase.auth.updateUser({ password: newPassword })
       ↓
Redirect to /dashboard
```

**Requirement:** The phone number must have been previously verified in
Settings (see flow below). If not, Supabase may create a new orphan user
instead of finding the existing account.

### Adding/changing phone in Settings (`SettingsPage.jsx` → Phone card)

```
User enters new phone number
       ↓
supabase.auth.updateUser({ phone })      ← Twilio sends 6-digit SMS
       ↓
User enters code
       ↓
supabase.auth.verifyOtp({ phone, token, type: 'phone_change' })
       ↓
Phone registered in auth.users + saved to profiles.phone
```

The Settings phone card is **live now** — users can add and verify their
number as soon as Twilio and the Supabase phone provider are configured.
Only the *forgot-password* phone path is gated.

---

## 5. Re-enabling the phone reset option in the UI

A single constant in `ForgotPasswordPage.jsx` controls the gate:

```js
// src/pages/ForgotPasswordPage.jsx  — top of file
const PHONE_RESET_ENABLED = false   // ← change to true
```

When `false`:
- The Phone tab in the method picker shows a "Soon" badge and is muted.
- Clicking it opens a "work in progress" modal instead of starting the OTP flow.
- All underlying phone-reset code remains compiled and ready.

When `true`:
- The Phone tab looks and behaves identically to the Email tab.
- The WIP modal is never shown.
- No other code changes are needed.

**Checklist before flipping the flag:**

- [ ] Twilio account created and a Messaging Service SID obtained
- [ ] Supabase Phone provider enabled with Twilio credentials
- [ ] Redirect URL `https://yourdomain.com/reset-password` added in Supabase
- [ ] At least one test user has verified their phone via Settings
- [ ] End-to-end test: request SMS code → enter code → set new password → sign in

---

## 6. Environment variables (reminder)

These must be set in Vercel (or your host) and in a local `.env` file:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Neither Twilio credential belongs in the frontend — Supabase holds them
server-side and uses them when it calls Twilio on your behalf.

'use client'
import { useActionState, use } from 'react'
import { login } from '@/app/admin/_actions/auth'
import { IconPin } from '@/app/admin/_components/icons'

export default function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = use(searchParams)
  const [state, action, pending] = useActionState(login, { error: '' })

  return (
    <div className="login-wrap">
      <form className="login-card" action={action}>
        <div className="sb-logo" style={{ width: 46, height: 46 }}><IconPin /></div>
        <h1>Pattaya Guide Admin</h1>
        <p>Enter the admin password to continue.</p>
        <input type="hidden" name="next" value={next || '/admin'} />
        <div className="field">
          <label>Password</label>
          <input className="input" type="password" name="password" autoFocus placeholder="••••••••" />
        </div>
        {state?.error && <div className="flash err" style={{ marginBottom: 16 }}>{state.error}</div>}
        <button className="btn btn--primary btn--block" disabled={pending}>{pending ? 'Checking…' : 'Sign in'}</button>
      </form>
    </div>
  )
}

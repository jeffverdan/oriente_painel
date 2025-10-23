// src/pages/forgot.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Forgot() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: (typeof window !== 'undefined' ? window.location.origin : '') + '/login'
    })
    setLoading(false)
    if (error) return setMsg('Erro: ' + error.message)
    setMsg('E-mail de recuperação enviado. Verifique sua caixa de entrada.')
  }

  return (
    <main style={{maxWidth: 420, margin: '40px auto'}}>
      <h1>Recuperar senha</h1>
      <form onSubmit={handleReset}>
        <label>
          E-mail
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <button type="submit" disabled={loading}>Enviar</button>
      </form>
      {msg && <p>{msg}</p>}
    </main>
  )
}

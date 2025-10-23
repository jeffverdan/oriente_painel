// src/pages/index.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import { User } from '@supabase/supabase-js'
import HeadSeo from '@/componentes/HeadSeo/HeadSeo';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getSession()
      if (!data.session) return router.push('/login')      
      setUser(data.session.user);
      router.push('/dashboard')
    
    }
    check()
  }, [router])

  if (!user) return <div>Carregando...</div>

  return (
    <main>
      <HeadSeo titlePage='Dashboard' description='' />
    </main>
  )
}

// src/pages/_app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import { Inter } from "next/font/google";
import HeadSeo from '@/componentes/HeadSeo/HeadSeo';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    // opcional: escuta alterações de auth e redireciona
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && router.pathname !== '/login' && router.pathname !== '/forgot') {
        router.push('/login')
      }
      if (session && router.pathname === '/login') {
        router.push('/')
      }
    })
    return () => listener?.subscription.unsubscribe()
  }, [router])


  return (
    <div className={inter.variable}>
        <HeadSeo titlePage='' description='' />
        <Component {...pageProps} />
    </div>
  );
}

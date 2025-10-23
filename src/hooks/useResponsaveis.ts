'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Responsavel } from '@/types/responsavel'

export function useResponsaveis() {
  const [responsaveis, setResponsaveis] = useState<Omit<Responsavel[], 'created_at' |'updated_at'>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchresponsaveis()
  }, [])

  async function fetchresponsaveis() {
    setLoading(true)
    const { data, error } = await supabase
      .from('responsaveis')
      .select('id, nome, email, telefone')
      .order('nome', { ascending: true })

    if (error) console.error('Erro ao buscar usuários:', error)
    else setResponsaveis(data as Omit<Responsavel[], 'created_at' |'updated_at'> || [])
    setLoading(false)
  }

  return { responsaveis, loading, fetchresponsaveis }
}

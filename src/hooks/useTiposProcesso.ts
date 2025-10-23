'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export interface TipoProcesso {
  id: number
  nome: string
}

export function useTiposProcesso() {
  const [tiposProcesso, setTiposProcesso] = useState<TipoProcesso[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTiposProcesso()
  }, [])

  async function fetchTiposProcesso() {
    setLoading(true)
    const { data, error } = await supabase
      .from('tipos_processo')
      .select('id, nome')
      .order('nome', { ascending: true })

    if (error) console.error('Erro ao buscar tipos de processo:', error)
    else setTiposProcesso(data || [])
    setLoading(false)
  }

  return { tiposProcesso, loading, fetchTiposProcesso }
}

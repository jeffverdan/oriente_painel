'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { TipoAlteracao } from '@/types/processo'

export function useTiposAlteracao() {
  const [tiposAlteracao, setTiposAlteracao] = useState<TipoAlteracao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTiposAlteracao()
  }, [])

  async function fetchTiposAlteracao() {
    setLoading(true)
    const { data, error } = await supabase
      .from('tipos_alteracao')
      .select('id, descricao, categoria')
      .order('categoria', { ascending: true })

    if (error) console.error('Erro ao buscar tipos de alteração:', error)
    else setTiposAlteracao(data || [])
    setLoading(false)
  }

  return { tiposAlteracao, loading, fetchTiposAlteracao }
}

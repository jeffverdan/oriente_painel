'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { KeysStatus, StatusProcesso } from '@/types/processo'

export function useStatusProcesso() {
  const [statusList, setStatusList] = useState<StatusProcesso[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatusProcesso()
  }, [])

  async function fetchStatusProcesso() {
    setLoading(true)
    const { data, error } = await supabase
      .from('status_processo')
      .select('id, nome')
      .order('id', { ascending: true })

    if (error) console.error('Erro ao buscar status de processo:', error)
    else setStatusList(data || [])
    setLoading(false)
  }

  return { statusList, loading, fetchStatusProcesso }
}

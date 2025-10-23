'use client'
import { useEffect, useState } from 'react'
import { getObservacoesByProcesso } from '@/lib/db/observacoes'
import { ObservacaoProcesso } from '@/types/observacao'

export function useObservacoes(processoId?: number) {
  const [observacoes, setObservacoes] = useState<ObservacaoProcesso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (processoId) fetchObservacoes(processoId)
  }, [processoId])

  async function fetchObservacoes(processoId: number) {
    setLoading(true)
    try {
      const data = await getObservacoesByProcesso(processoId)
      setObservacoes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return { observacoes, loading, error, fetchObservacoes }
}

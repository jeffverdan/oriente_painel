'use client'
import { useEffect, useState } from 'react'
import { getAtividadesByEmpresa } from '@/lib/db/atividades'
import { Atividade } from '@/types/empresa'

export function useAtividades(empresaId?: number) {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown | null>(null)

  useEffect(() => {
    if (empresaId) fetchAtividades(empresaId)
  }, [empresaId])

  async function fetchAtividades(empresaId: number) {
    setLoading(true)
    try {
      const data = await getAtividadesByEmpresa(empresaId)
      setAtividades(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return { atividades, loading, error, fetchAtividades }
}

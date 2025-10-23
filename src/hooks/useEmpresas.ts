'use client'
import { useEffect, useState } from 'react'
import { Empresa } from '@/types/empresa'
import { getEmpresas } from '@/lib/db/empresas'
import { formatCNPJ } from '@/lib/formatters'


export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    fetchEmpresas()
  }, [])

  async function fetchEmpresas() {
    setLoading(true)
    try {
      const data = await getEmpresas();
      data.forEach(empresa => {
        empresa.cnpj = formatCNPJ(empresa.cnpj || '')
      })
      setEmpresas(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return { empresas, loading, error, fetchEmpresas }
}

import { supabase } from '@/lib/supabaseClient'
import { Historico } from '@/types/historico'

const usuario = (await supabase.auth.getUser()).data.user;
/**
 * Registra uma alteração (empresa ou processo).
 */
export async function registrarHistorico({
  processo_id,
  empresa_id,
  campo_alterado,
  valor_anterior,
  valor_novo,  
}: Omit<Historico, 'id' | 'data_alteracao'>) {
  const { error } = await supabase.from('historico_processos').insert([
    {
      processo_id: processo_id ?? null,
      empresa_id: empresa_id ?? null,
      campo_alterado,
      valor_anterior,
      valor_novo,
      alterado_por: usuario?.email,
      data_alteracao: new Date().toISOString(),
    },
  ])

  if (error) console.error('Erro ao registrar histórico:', error)
}

/**
 * Retorna o histórico de um processo específico.
 */
export async function getHistoricoByProcesso(processoId: number) {
  const { data, error } = await supabase
    .from('historico_processos')
    .select(
      'id, campo_alterado, valor_anterior, valor_novo, data_alteracao, alterado_por (id, nome)'
    )
    .eq('processo_id', processoId)
    .order('data_alteracao', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

/**
 * Retorna o histórico de uma empresa específica.
 */
export async function getHistoricoByEmpresa(empresaId: number) {
  const { data, error } = await supabase
    .from('historico_processos')
    .select(
      'id, campo_alterado, valor_anterior, valor_novo, data_alteracao, alterado_por (id, nome)'
    )
    .eq('empresa_id', empresaId)
    .order('data_alteracao', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

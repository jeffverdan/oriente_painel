import { supabase } from '@/lib/supabaseClient'
import { Atividade } from '@/types/empresa'
import { registrarHistorico } from './historico'

/**
 * Busca todas as atividades de uma empresa.
 */
export async function getAtividadesByEmpresa(empresaId: number | null) {
  if(!empresaId) return []
  const { data, error } = await supabase
    .from('atividades')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('tipo', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

/**
 * Cria uma nova atividade vinculada à empresa.
 */
export async function createAtividade(data: Omit<Atividade, 'id'>) {
  const { data: newAtividade, error } = await supabase
    .from('atividades')
    .insert([data])
    .select('*')
    .single()

  if (error) throw new Error(error.message)
    
  await registrarHistorico({
    empresa_id: data.empresa_id,
    campo_alterado: 'Nova Atividade',
    valor_anterior: null,
    valor_novo: JSON.stringify(newAtividade),
  })

  return newAtividade
}

/**
 * Atualiza uma atividade existente.
 */
export async function updateAtividade(data: Partial<Atividade>) {
  if (!data.id) throw new Error('ID da atividade é obrigatório para atualização.')

  const { error } = await supabase
    .from('atividades')
    .update({
      tipo: data.tipo,
      cnae_codigo: data.cnae_codigo,
      descricao: data.descricao,
    })
    .eq('id', data.id)

  if (error) throw new Error(error.message)
  return true
}

/**
 * Exclui uma atividade (hard delete).
 */
export async function deleteAtividade(id: number) {
  const { error } = await supabase.from('atividades').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return true
}

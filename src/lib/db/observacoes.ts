import { supabase } from '@/lib/supabaseClient'

const usuario = (await supabase.auth.getUser()).data.user;
/**
 * Lista todas as observações de um processo.
 */
export async function getObservacoesByProcesso(processoId: number) {
  const { data, error } = await supabase
    .from('observacoes_processos')
    .select(`
      id,
      texto,
      processo_id,
      status_id,
      criado_em,
      criado_por
    `)
    .eq('processo_id', processoId)
    .order('criado_em', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

/**
 * Cria uma nova observação vinculada a um processo.
 */
export async function createObservacao(processoId: number, texto: string, status_id?: number) {
  const { data, error } = await supabase
    .from('observacoes_processos')
    .insert([
      {
        processo_id: processoId,
        texto,
        status_id,
        criado_por: usuario?.email,
        criado_em: new Date().toISOString(),
      },
    ])
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Atualiza uma observação existente.
 */
export async function updateObservacao(id: number, texto: string) {
  const { error } = await supabase
    .from('observacoes_processos')
    .update({ texto })
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

/**
 * Exclui uma observação.
 */
export async function deleteObservacao(id: number) {
  const { error } = await supabase
    .from('observacoes_processos')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

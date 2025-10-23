import { supabase } from '@/lib/supabaseClient'
import { ObservacaoProcesso } from '@/types/observacao'
import { Processo, TipoAlteracao } from '@/types/processo'
import { registrarHistorico } from './historico'
import { createObservacao } from './observacoes';
import { syncTiposAlteracao } from './tipos_alteracao';
const usuario = (await supabase.auth.getUser()).data.user;

type RawProcesso = {
    id: number;
    data_inicio: string | null;
    data_envio_junta: string | null;
    data_conclusao: string | null;
    empresa: number | null;
    responsavel: { id: number; nome: string } | null;
    tipo_processo: { id: number; nome: string } | null;
    status: { id: number; nome: string } | null;
    tipos_alteracao: {
      id_tipo_alteracao: number;
      tipo_alteracao: {
        id: number;
        categoria: string;
        descricao: string;
      } | null;
    }[];
  };
  

export async function getProcessos() {
    const { data, error } = await supabase
        .from('processos')
        .select(`
        id,
        data_inicio,
        data_envio_junta,
        data_conclusao,
        empresa:empresa_id,
        responsavel:responsavel_id (id, nome),
        tipo_processo:tipo_processo_id (id, nome),
        status:status_id (id, nome),
        tipos_alteracao:processos_tipos_alteracao (
            id_tipo_alteracao: id,
            tipo_alteracao:tipo_alteracao_id (id, categoria, descricao)
        )
      `)
        .is('deleted_at', null)
        .order('id', { ascending: false })

    if (error) throw new Error(error.message)
        console.log("Tipos Altercao: ", data.map(p => p.tipos_alteracao));

    // força o tipo aqui
    const rawData = (data || []) as unknown as RawProcesso[];
        
    // Normaliza o array de tipos de alteração
    const processos = (rawData || []).map((p) => ({
        ...p,
        tipos_alteracao: p.tipos_alteracao.map((ta) => ({
            id: ta.tipo_alteracao?.id,
            id_tabela: ta.id_tipo_alteracao,
            categoria: ta.tipo_alteracao?.categoria,
            descricao: ta.tipo_alteracao?.descricao,
        })) as TipoAlteracao[],
        observacoes: [] as ObservacaoProcesso[],
    }))

    return processos
}

/**
 * Cria um novo processo.
 */
export async function createProcesso(data: Partial<Processo>) {
    const { data: newProcesso, error } = await supabase
        .from('processos')
        .insert([
            {
                empresa_id: data.empresa?.id,
                responsavel_id: data.responsavel?.id,
                tipo_processo_id: data.tipo_processo?.id,
                status_id: data.status?.id,
                data_inicio: new Date().toISOString().split('T')[0],
            },
        ])
        .select('*')
        .single()

    if (error) throw new Error(error.message)
    if (newProcesso) {
        await syncTiposAlteracao(data.tipos_alteracao || [], newProcesso.id);
        
        if (data.observacoes && data.observacoes.length > 0) {
            data.observacoes.filter(obs => !obs.id).forEach(async obs =>
                await createObservacao(
                    newProcesso.id,
                    obs.texto,
                    data.status?.id || 0
                )
            )
        }
        await registrarHistorico({
            processo_id: newProcesso.id,
            campo_alterado: 'Criação',
            valor_anterior: null,
            valor_novo: JSON.stringify(newProcesso),
        })
    }

    return newProcesso
}

/**
 * Atualiza um processo existente.
 */
export async function updateProcesso(data: Partial<Processo>) {
    if (!data.id) throw new Error('ID do processo é obrigatório para atualização')

    const { data: processoAntigo } = await supabase
        .from('processos')
        .select('*')
        .eq('id', data.id)
        .single()

    const { error } = await supabase
        .from('processos')
        .update({
            empresa_id: data.empresa?.id,
            responsavel_id: data.responsavel?.id,
            tipo_processo_id: data.tipo_processo?.id,
            status_id: data.status?.id,
            data_envio_junta: data.data_envio_junta,
            data_conclusao: data.data_conclusao,
            updated_at: new Date().toISOString(),
        })
        .eq('id', data.id)

    if (error) throw new Error(error.message)
    console.log("data.tipos_alteracao: ", data.tipos_alteracao);    

    await syncTiposAlteracao(data.tipos_alteracao || [], data.id);
    
    if (!!data.id && data.observacoes && data.observacoes.length > 0) {
        data.observacoes.filter(obs => !obs.id).forEach(async obs =>
            await createObservacao(
                data.id || 0,
                obs.texto,
                data.status?.id || 0
            )
        )
    }
    await registrarHistorico({
        processo_id: data.id,
        campo_alterado: 'Atualização',
        valor_anterior: JSON.stringify(processoAntigo),
        valor_novo: JSON.stringify(data),
    })
    return true
}

/**
 * Soft delete: marca um processo como deletado.
 */
export async function deleteProcesso(id: number) {
    const { data: processoAntigo } = await supabase
        .from('processos')
        .select('*')
        .eq('id', id)
        .single()

    const { error } = await supabase
        .from('processos')
        .update({
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) throw new Error(error.message)



    await registrarHistorico({
        processo_id: id,
        campo_alterado: 'Exclusão',
        valor_anterior: JSON.stringify(processoAntigo),
        valor_novo: null,
    })

    return true
}

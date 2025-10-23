import { supabase } from '@/lib/supabaseClient'
import { Empresa } from '@/types/empresa'
import { registrarHistorico } from './historico'
import { createAtividade } from './atividades'
import { formatCNPJ } from '../formatters';

/**
 * Busca todas as empresas (com atividades relacionadas).
 */
export async function getEmpresaById(id: number) {
    if(!id) return undefined;
    
    const { data, error } = await supabase
        .from('empresas')
        .select(`
        id,   
        nome,
        cnpj,
        porte,
        natureza_juridica,
        logradouro,
        numero,
        complemento,
        municipio,
        bairro,
        uf,
        cep,
        simples_optante,
        simples_data_opcao,
        simples_data_exclusao,
        simei_optante,
        simei_data_opcao,
        simei_data_exclusao,
        situacao
    `)
        .eq('id', id)

    if (error) throw new Error(error.message)
    data.forEach(empresa => {
        empresa.cnpj = formatCNPJ(empresa.cnpj || '')
    })
    return data[0] || undefined
}

/**
 * Busca todas as empresas (com atividades relacionadas).
 */
export async function getEmpresas() {
    const { data, error } = await supabase
        .from('empresas')
        .select(`
        id,
        nome,
        cnpj,
        porte,
        natureza_juridica,
        logradouro,
        numero,
        complemento,
        municipio,
        bairro,
        uf,
        cep,
        simples_optante,
        simples_data_opcao,
        simples_data_exclusao,
        simei_optante,
        simei_data_opcao,
        simei_data_exclusao,
        situacao
    `)
        .order('nome', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
}

/**
 * Cria uma nova empresa.
 */
export async function createEmpresa(data: Partial<Empresa>) {
    const cleanCnpj = (data.cnpj || '').replace(/\D/g, '')
    const { data: newEmpresa, error } = await supabase
        .from('empresas')
        .insert([
            {
                nome: data.nome,
                cnpj: cleanCnpj,
                porte: data.porte,
                natureza_juridica: data.natureza_juridica,
                logradouro: data.logradouro,
                numero: data.numero,
                complemento: data.complemento,
                municipio: data.municipio,
                bairro: data.bairro,
                uf: data.uf,
                cep: data.cep,
                simples_optante: data.simples_optante ?? false,
                simples_data_opcao: data.simples_data_opcao,
                simples_data_exclusao: data.simples_data_exclusao,
                simei_optante: data.simei_optante ?? false,
                simei_data_opcao: data.simei_data_opcao,
                simei_data_exclusao: data.simei_data_exclusao,
                situacao: data.situacao,
            },
        ])
        .select('*')
        .single()

    if (error) throw new Error(error.message);

    if (!!data.atividades?.[0]) {
        for (const atv of data.atividades) {
            const { data: newAtividade, error } = await supabase
                .from('atividades')
                .insert([{
                    empresa_id: newEmpresa.id,
                    descricao: atv.descricao,
                    cnae_codigo: atv.cnae_codigo,
                    tipo: atv.tipo
                }])
                .select('*')
                .single()
            if (error) throw new Error(error.message)
        }
    }

    await registrarHistorico({
        empresa_id: newEmpresa.id,
        campo_alterado: 'Criação',
        valor_anterior: null,
        valor_novo: JSON.stringify(newEmpresa),
    });

    return newEmpresa
}

/**
 * Atualiza uma empresa existente.
 */
export async function updateEmpresa(data: Partial<Empresa>) {
    if (!data.id) throw new Error('ID da empresa é obrigatório para atualização.');

    const { data: antigo } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', data.id)
        .single()

    const { error } = await supabase
        .from('empresas')
        .update({
            nome: data.nome,
            porte: data.porte,
            natureza_juridica: data.natureza_juridica,
            logradouro: data.logradouro,
            numero: data.numero,
            complemento: data.complemento,
            municipio: data.municipio,
            bairro: data.bairro,
            uf: data.uf,
            cep: data.cep,
            simples_optante: data.simples_optante,
            simples_data_opcao: data.simples_data_opcao,
            simples_data_exclusao: data.simples_data_exclusao,
            simei_optante: data.simei_optante,
            simei_data_opcao: data.simei_data_opcao,
            simei_data_exclusao: data.simei_data_exclusao,
            updated_at: new Date().toISOString(),
        })
        .eq('id', data.id)

    if (error) throw new Error(error.message)

    await registrarHistorico({
        empresa_id: data.id,
        campo_alterado: 'Atualização',
        valor_anterior: JSON.stringify(antigo),
        valor_novo: JSON.stringify(data),
    })

    return true
}

/**
 * Exclui uma empresa (soft delete).
 */
export async function deleteEmpresa(id: number) {
    const { error } = await supabase
        .from('empresas')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()

    if (error) throw new Error(error.message)
    return true
}

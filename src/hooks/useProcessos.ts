import { useState, useEffect } from 'react'
import { Processo, StatusProcesso, TipoAlteracao, TipoProcesso } from '@/types/processo'
import { PostgrestError } from '@supabase/supabase-js';
import { Empresa } from '@/types/empresa';
import { Responsavel } from '@/types/responsavel';
import { getObservacoesByProcesso } from '@/lib/db/observacoes';
import { getProcessos } from '@/lib/db/processos';
import { getEmpresaById } from '@/lib/db/empresas';
import { getAtividadesByEmpresa } from '@/lib/db/atividades';


export type DataSupabaseProcesso = {
    data: {
        id: number,
        data_inicio: string,
        data_envio_junta: string | null,
        data_conclusao: string | null,
        created_at: string,
        updated_at: string,
        deleted_at: string | null,
        empresas: Empresa,
        responsaveis: Responsavel,
        tipos_processo: TipoProcesso,
        status_processo: StatusProcesso,
        tipos_alteracao: TipoAlteracao | null
    }[],
    error: PostgrestError | null
};



export function useProcessos() {
    const [processos, setProcessos] = useState<Processo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProcessos()
    }, [])


    async function fetchProcessos() {
        setLoading(true)

        const data = await getProcessos();
        console.log("Empresa: ", data);
        
        const dataComplete = data.map(async (processo) => ({
            ...processo,
            observacoes: await getObservacoesByProcesso(processo.id),
            empresa: {
                ...await getEmpresaById(processo.empresa),
                atividades: await getAtividadesByEmpresa(processo.empresa)
            }
        })) as unknown as Promise<Processo>[];
        console.log(await Promise.all(dataComplete));

        await Promise.all(dataComplete).then((results) => setProcessos(results || []));

        setLoading(false)
    }


    return { processos, loading, fetchProcessos }
}
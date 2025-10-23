import { Empresa } from './empresa'
import { ObservacaoProcesso } from './observacao'
import { Responsavel } from './responsavel'


export interface TipoAlteracao {
    id: number
    id_tabela?: number
    categoria: string
    descricao: string
}

export type KeysStatus = 'Concluído' | 'Em Andamento' | 'Aguardando Cliente' | 'Cancelado';
export interface StatusProcesso {
    id: number
    nome: KeysStatus
}

export interface TipoProcesso {
    id: number
    nome: string
}



export interface Processo {
    id: number
    empresa: Empresa
    responsavel: Responsavel | null
    tipo_processo: TipoProcesso    
    status: StatusProcesso
    observacoes: ObservacaoProcesso[]
    tipos_alteracao?: TipoAlteracao[] | null
    data_inicio: string
    data_envio_junta?: string | null
    data_conclusao?: string | null
    created_at?: string
    updated_at?: string
    deleted_at?: string | null
}
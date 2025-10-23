import { User } from '@supabase/supabase-js'


export interface Historico {
    id: number
    processo_id?: number
    empresa_id?: number
    usuario_id?: number
    campo_alterado: string
    valor_anterior?: string | null
    valor_novo?: string | null
    alterado_por?: User | null
    data_alteracao: string
}
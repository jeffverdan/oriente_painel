import { Responsavel } from './responsavel'


export interface ObservacaoProcesso {
    id: number
    processo_id: number
    texto: string
    criado_por?: Responsavel | null
    criado_em: string
}
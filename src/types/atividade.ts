export interface Atividade {
    id: number
    empresa_id: number
    tipo: 'principal' | 'secundaria'
    cnae_codigo: string
    descricao: string
}
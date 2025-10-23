export interface Atividade {
    id: number
    empresa_id: number
    tipo: 'principal' | 'secundaria'
    cnae_codigo: string
    descricao: string
}

export interface Empresa {
    id: number
    nome: string
    cnpj: string
    situacao?: string
    porte?: string
    natureza_juridica?: string
    logradouro?: string
    numero?: string
    complemento?: string
    municipio?: string
    bairro?: string
    uf?: string
    cep?: string
    simples_optante: boolean
    simples_data_opcao?: string | null
    simples_data_exclusao?: string | null
    simei_optante: boolean
    simei_data_opcao?: string | null
    simei_data_exclusao?: string | null
    created_at?: string | undefined
    updated_at?: string | undefined
    atividades?: Atividade[]
}
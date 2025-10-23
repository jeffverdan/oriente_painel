'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';

export interface ConsultaReceitaWS {
    "status": "OK",
    "ultima_atualizacao": string
    "cnpj": string,
    "tipo": "MATRIZ" | "FILIAL",
    "porte": string,
    "nome": string,
    "fantasia": string,
    "abertura": string,
    "atividade_principal": {
        "code": string,
        "text": string
    }[],
    "atividades_secundarias": {
        "code": string,
        "text": string
    }[],
    "natureza_juridica": string,
    "logradouro": string,
    "numero": string,
    "complemento": string,
    "cep": string,
    "bairro": string,
    "municipio": string,
    "uf": string,
    "email": string,
    "telefone": string,
    "efr": string,
    "situacao": string,
    "data_situacao": string,
    "motivo_situacao": string,
    "situacao_especial": string,
    "data_situacao_especial": string,
    "capital_social": string,
    "qsa": {
        "nome": string,
        "qual": string,
        "pais_origem": string,
        "nome_rep_legal": string,
        "qual_rep_legal": string
    }[],
    "simples": {
        "optante": true,
        "data_opcao": string
        "data_exclusao": string
        "ultima_atualizacao": string
    },
    "simei": {
        "optante": true,
        "data_opcao": string
        "data_exclusao": string
        "ultima_atualizacao": string
    },
    "billing": {
        "free": true,
        "database": true
    }
}

export async function ConsultaCNPJ({ cnpj, days }: { cnpj: string; days: number }): Promise<ConsultaReceitaWS | undefined> {    
    try {
        const response = await fetch(`/api/consulta-cnpj?cnpj=${cnpj}&days=${days}`);
        console.log("Response Receita WS:", response);
        
        const data = await response.json();
        console.log("Consulta Receita WS:", data);
        return data as ConsultaReceitaWS;
    } catch (error) {
        console.error(error);        
    }
}

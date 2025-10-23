import { useEffect, useRef, useState } from "react";
import { Processo } from "@/types/processo";
import { ObservacaoProcesso } from "@/types/observacao";
import { ChevronDownIcon } from "@/lib/icons";
import { useTiposAlteracao } from "@/hooks/useTiposAlteracao";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useResponsaveis } from "@/hooks/useResponsaveis";
import { useTiposProcesso } from "@/hooks/useTiposProcesso";
import { useStatusProcesso } from "@/hooks/useStatusProcesso";
import { ConsultaCNPJ } from "@/apis/ConsultaCNPJ";
import { Empresa } from "@/types/empresa";
import { getAtividadesByEmpresa } from "@/lib/db/atividades";

export const ProcessoModal = ({
    isOpen,
    onClose,
    onSave,
    processo,
}: {
    isOpen: boolean
    onClose: () => void
    onSave: (data: Partial<Processo>) => void
    processo: Processo | null
}) => {
    const [formData, setFormData] = useState<Partial<Processo>>({})
    const [newNote, setNewNote] = useState('');
    const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
    const [cnpjLoading, setCnpjLoading] = useState(false);
    const [cnpjError, setCnpjError] = useState<string | null>(null);
    const [isApiInfoOpen, setIsApiInfoOpen] = useState(false);
    const { responsaveis } = useResponsaveis();
    const { tiposProcesso } = useTiposProcesso();
    const { tiposAlteracao } = useTiposAlteracao();
    const { statusList } = useStatusProcesso();
    const { empresas } = useEmpresas();
    const [searchTerm, setSearchTerm] = useState('');


    const autocompleteRef = useRef<HTMLDivElement>(null);
    console.log(processo);

    useEffect(() => {
        if (processo) {
            setFormData({
                ...processo,
            })
        } else {
            setFormData({
                tipo_processo: { id: 1, nome: 'Constituição' },
                status: { id: 2, nome: 'Em Andamento' },
            })
        }
        setNewNote("")
        return () => {
            setFormData({})
            setNewNote("")
        };
    }, [processo, isOpen])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) setAutocompleteOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "tipo_processo") {
            const selectedTipo = tiposProcesso.find(tipo => tipo.id === Number(value));
            setFormData(prev => ({ ...prev, tipo_processo: selectedTipo, tipos_alteracao: [] }));
        } else if (name === "status") {
            const selectedStatus = statusList.find(status => status.id === Number(value));
            setFormData(prev => ({ ...prev, status: selectedStatus }));
        } else if (name === "responsavel") {
            const selectedResponsavel = responsaveis.find(resp => resp.id === Number(value));
            setFormData(prev => ({ ...prev, responsavel: selectedResponsavel }));
        } else if (name.startsWith("empresa.")) {
            const empresaField = name.split(".")[1];
            const empresa = { ...formData.empresa, [empresaField]: value } as Empresa;
            setFormData(prev => ({
                ...prev,
                empresa: empresa
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            ...formData,
            observacoes: newNote.trim() ? [
                ...(formData.observacoes || []),
                {
                    id: 0,
                    texto: newNote,
                    criado_em: new Date().toISOString(),
                } as ObservacaoProcesso
            ] : formData.observacoes
        })
        onClose()
    };

    const cleanStateAndClose = () => {
        setAutocompleteOpen(false);
        onClose();
    };

    const handleCnpjLookup = async () => {
        const cnpj = formData.empresa?.cnpj?.replace(/\D/g, '');
        console.log("Consultando CNPJ:", cnpj);
        
        if (!cnpj || cnpj.length !== 14) {
            setCnpjError("CNPJ inválido. Deve conter 14 números.");
            return;
        }
        setCnpjLoading(true);
        setCnpjError(null);
        const empresa = empresas.find(emp => emp.cnpj.replace(/\D/g, '') === cnpj);

        if(!empresa) {
            try {
                const consulta = await ConsultaCNPJ({ cnpj, days: 1 });
                if(consulta?.status === 'OK') {
                    const data = consulta;
                    setFormData(prev => ({
                        ...prev,
                        empresa: {
                            ...prev.empresa,
                            id: 0,
                            nome: data.nome,
                            cnpj: data.cnpj,
                            situacao: data.situacao,
                            porte: data.porte,
                            natureza_juridica: data.natureza_juridica,
                            atividades: [
                                ...data.atividade_principal.map((a, index) => ({
                                    id: index,
                                    tipo: 'principal' as const,
                                    empresa_id: 0,
                                    cnae_codigo: a.code,
                                    descricao: a.text,
                                })),
                                ...data.atividades_secundarias.map((a, index) => ({
                                    id: index + data.atividade_principal.length,
                                    tipo: 'secundaria' as const,
                                    empresa_id: 0,
                                    cnae_codigo: a.code,
                                    descricao: a.text,
                                })),
                            ],
                            logradouro: data.logradouro,
                            numero: data.numero,
                            complemento: data.complemento,
                            bairro: data.bairro,
                            municipio: data.municipio,
                            uf: data.uf,
                            cep: data.cep,
                            simples_optante: data.simples.optante,
                            simples_data_opcao: data.simples.data_opcao,
                            simples_data_exclusao: data.simples.data_exclusao,
                            simei_optante: data.simei.optante,
                            simei_data_opcao: data.simei.data_opcao,
                            simei_data_exclusao: data.simei.data_exclusao
                        }
                    }));
                }
    
                setIsApiInfoOpen(true); // Abre o collapse com os dados novos
            } catch (error) {
                setCnpjError("Erro ao consultar CNPJ. Verifique o número e tente novamente.");
                console.error(error);
            } 
        } else {
            console.log("CNPJ encontrado na base local:", cnpj);
            const atividades = await getAtividadesByEmpresa(empresa.id);
            empresa.atividades = atividades;
            setFormData(prev => ({
                ...prev,
                empresa: empresa || prev.empresa
            }) );
        }
        setCnpjLoading(false);
    };

    const groupedAlteracaoOptions = tiposAlteracao.reduce((acc, option) => {
        if (!acc[option.categoria]) acc[option.categoria] = [];
        acc[option.categoria].push(option.descricao);
        return acc;
    }, {} as Record<string, string[]>);

    const handleAlteracaoToggle = (alteracao: string) => {
        setFormData(prev => {
            console.log("Toggling alteracao: ", alteracao);

            const currentAlteracoes = prev.tipos_alteracao || [];
            const isAlreadySelected = currentAlteracoes.some(a => a.descricao === alteracao);
            let newAlteracoes;
            if (isAlreadySelected) {
                newAlteracoes = currentAlteracoes.filter(a => a.descricao !== alteracao);
            } else {
                const alteracaoToAdd = tiposAlteracao.find(a => a.descricao === alteracao);
                if (!alteracaoToAdd) return prev; // Segurança extra
                newAlteracoes = [...currentAlteracoes, alteracaoToAdd];
            }

            return { ...prev, tipos_alteracao: newAlteracoes };
        });
    };

    console.log("FormData: ", formData);

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl transform transition-all max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 rounded-t-lg border-b sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold">{processo ? 'Editar Processo' : 'Adicionar Novo Processo'}</h3>
                    <button onClick={cleanStateAndClose} className="cursor-pointer text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                    {/* 1ª Linha: Tipo do Processo e Tipos de Alteração */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de Processo</label>
                            <select name="tipo_processo" value={formData.tipo_processo?.id} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                {tiposProcesso.map(tipo => (
                                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                ))}
                            </select>
                        </div>

                        {formData.tipo_processo?.nome === 'Alteração' && (
                            <div ref={autocompleteRef} className="relative">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tipos de Alteração
                                </label>

                                <div
                                    onClick={() => setAutocompleteOpen(!isAutocompleteOpen)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white cursor-pointer min-h-[42px] flex items-center flex-wrap gap-1"
                                >
                                    {formData.tipos_alteracao?.length === 0 ? (
                                        <span className="text-gray-400">Selecione...</span>
                                    ) : (
                                        formData.tipos_alteracao?.map(item => (
                                            <span
                                                key={item.id}
                                                className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full"
                                            >
                                                {item.descricao}
                                            </span>
                                        ))
                                    )}
                                </div>

                                {isAutocompleteOpen && (
                                    <div className="absolute z-20 mt-1 w-full bg-white shadow-lg border rounded-md max-h-60 overflow-auto">
                                        {/* 🔍 Campo de busca */}
                                        <div className="sticky top-0 bg-white border-b">
                                            <input
                                                type="text"
                                                placeholder="Buscar tipo..."
                                                className="w-full px-3 py-2 text-sm outline-none"
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                autoFocus
                                            />
                                        </div>

                                        {/* Lista filtrada */}
                                        {Object.entries(groupedAlteracaoOptions).map(([category, types]) => {
                                            const filtered = types.filter(t =>
                                                t.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            if (filtered.length === 0) return null

                                            return (
                                                <div key={category}>
                                                    <h4 className="text-xs font-bold uppercase text-gray-500 px-3 py-2 bg-gray-50">
                                                        {category}
                                                    </h4>
                                                    <ul>
                                                        {filtered.map(type => (
                                                            <li
                                                                key={type}
                                                                onClick={() => handleAlteracaoToggle(type)}
                                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    readOnly
                                                                    checked={
                                                                        formData.tipos_alteracao?.some(
                                                                            a => a.descricao === type
                                                                        ) || false
                                                                    }
                                                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                />
                                                                <span className="ml-3 text-sm text-gray-700">
                                                                    {type}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    {/* 2ª Linha: CNPJ e Razão Social */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.tipo_processo?.nome !== 'Constituição' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                                <div className="mt-1 flex gap-2">
                                    <input type="text" name="empresa.cnpj" value={formData.empresa?.cnpj} onChange={handleChange} className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="00.000.000/0000-00" />
                                    <button type="button" onClick={handleCnpjLookup} disabled={cnpjLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center justify-center w-32">
                                        {cnpjLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Consultar'}
                                    </button>
                                </div>
                                {cnpjError && <p className="text-xs text-red-600 mt-1">{cnpjError}</p>}
                            </div>
                        )}
                        <div className={formData.tipo_processo?.nome === 'Constituição' ? 'md:col-span-2' : ''}>
                            <label className="block text-sm font-medium text-gray-700">Nome da Empresa / Razão Social</label>
                            <input type="text" name="empresa" value={formData.empresa?.nome} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>

                    {/* 3ª Linha: Status e Responsável */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status?.id || ''}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="" disabled>Selecione o status</option>
                                {statusList.map(status => (
                                    <option key={status.id} value={status.id}>{status.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Responsável</label>
                            <select
                                name="responsavel"
                                value={formData.responsavel?.id || ''}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="" disabled>Selecione o responsável</option>
                                {responsaveis.map(resp => (
                                    <option key={resp.id} value={resp.id}>{resp.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 4ª Linha: Notas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notas de Ações</label>
                        {!!formData.observacoes?.[0] && (
                            <div className="mb-3 max-h-28 overflow-y-auto space-y-2 border p-3 rounded-md bg-slate-50">
                                {formData.observacoes.map((note, index) => (
                                    <div key={index} className="text-xs text-gray-600">
                                        <p className="font-semibold text-gray-700">
                                            {new Date(note.criado_em).toLocaleString('pt-BR')}
                                        </p>
                                        <p>{note.texto}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Adicionar nova nota..."
                            rows={2}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        </textarea>
                    </div>

                    {/* Collapse: Informações da API */}
                    {formData.tipo_processo?.nome !== 'Constituição' && (
                        <div>
                            <button type="button" onClick={() => setIsApiInfoOpen(!isApiInfoOpen)} className="w-full flex justify-between items-center p-3 bg-gray-50 border rounded-md hover:bg-gray-100">
                                <span className="font-medium text-gray-700">Informações da Empresa (Receita Federal)</span>
                                <ChevronDownIcon />
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ${isApiInfoOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-4 border border-t-0 rounded-b-md space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Situação</label>
                                            <input
                                                type="text"
                                                name="situacao"
                                                value={formData.empresa?.situacao}
                                                className="mt-1 bg-gray-100 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Porte</label>
                                            <input
                                                type="text"
                                                name="porte"
                                                value={formData.empresa?.porte}
                                                className="mt-1 bg-gray-100 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Natureza Jurídica</label>
                                            <input
                                                type="text"
                                                name="natureza_juridica"
                                                value={formData.empresa?.natureza_juridica}
                                                className="mt-1 bg-gray-100 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Atividade Principal</label>
                                            <div className="p-3 border rounded-md bg-slate-50 text-sm h-full">
                                                {formData.empresa?.atividades?.filter(f => f.tipo === 'principal').map(a =>
                                                    <div key={a.id}>
                                                        <p className="font-semibold">
                                                            {a.cnae_codigo}
                                                        </p>
                                                        <p className="text-gray-600">
                                                            {a.descricao}
                                                        </p>
                                                    </div>) || <p className="text-gray-400">N/A</p>
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Atividades Secundárias</label>
                                            <div className="p-3 border rounded-md bg-slate-50 text-sm h-full max-h-32 overflow-y-auto">
                                                {formData.empresa?.atividades?.filter(f => f.tipo === 'secundaria').map(a =>
                                                    <div key={a.id} className="mb-2">
                                                        <p className="font-semibold">
                                                            {a.cnae_codigo}
                                                        </p>
                                                        <p className="text-gray-600">
                                                            {a.descricao}
                                                        </p>
                                                    </div>) || <p className="text-gray-400">N/A</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <fieldset className="border p-4 rounded-md">
                                        <legend className="px-2 text-sm font-medium">Endereço</legend>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="md:col-span-3">
                                                <label className="block text-xs text-gray-600">Logradouro</label>
                                                <input type="text" name="logradouro" value={formData.empresa?.logradouro} className="mt-1 bg-gray-100 w-full border-gray-300 rounded-md p-2 text-sm" readOnly />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600">Número</label>
                                                <input type="text" name="numero" value={formData.empresa?.numero} className="mt-1 bg-gray-100 w-full border-gray-300 rounded-md p-2 text-sm" readOnly />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs text-gray-600">Complemento</label>
                                                <input type="text" name="complemento" value={formData.empresa?.complemento} className="mt-1 bg-gray-100 w-full border-gray-300 rounded-md p-2 text-sm" readOnly />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs text-gray-600">Bairro</label>
                                                <input type="text" name="bairro" value={formData.empresa?.bairro} className="mt-1 bg-gray-100 w-full border-gray-300 rounded-md p-2 text-sm" readOnly />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs text-gray-600">Município</label>
                                                <input type="text" name="municipio" value={formData.empresa?.municipio} className="mt-1 bg-gray-100 w-full border-gray-300 rounded-md p-2 text-sm" readOnly />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600">UF</label>
                                                <input type="text" name="uf" value={formData.empresa?.uf} className="mt-1 bg-gray-100 w-full border-gray-300 rounded-md p-2 text-sm" readOnly />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600">CEP</label>
                                                <input type="text" name="cep" value={formData.empresa?.cep} className="mt-1 bg-gray-100 w-full border-gray-300 rounded-md p-2 text-sm" readOnly />
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <fieldset className="border p-4 rounded-md">
                                            <legend className="px-2 text-sm font-medium">Simples</legend>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" name="simples_optante" checked={!!formData.empresa?.simples_optante} onChange={handleChange} className="h-4 w-4 bg-gray-100" disabled />
                                                    <label>Optante</label>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600">Data Opção</label>
                                                    <input type="text" name="simples_data_opcao" value={formData.empresa?.simples_data_opcao || ''} className="mt-1 bg-gray-100 w-full rounded-md p-2 text-sm" readOnly />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600">Data Exclusão</label>
                                                    <input type="text" name="simples_data_exclusao" value={formData.empresa?.simples_data_exclusao || ''} className="mt-1 bg-gray-100 w-full rounded-md p-2 text-sm" readOnly />
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset className="border p-4 rounded-md">
                                            <legend className="px-2 text-sm font-medium">SIMEI</legend>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" name="simei_optante" checked={!!formData.empresa?.simei_optante} onChange={handleChange} className="h-4 w-4 bg-gray-100" disabled />
                                                    <label>Optante</label>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600">Data Opção</label>
                                                    <input type="text" name="simei_data_opcao" value={formData.empresa?.simei_data_opcao || ''} className="mt-1 bg-gray-100 w-full rounded-md p-2 text-sm" readOnly />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600">Data Exclusão</label>
                                                    <input type="text" name="simei_data_exclusao" value={formData.empresa?.simei_data_exclusao || ''} className="mt-1 bg-gray-100 w-full rounded-md p-2 text-sm" readOnly />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4 border-t mt-6 sticky bottom-0 bg-white py-4 z-10">
                        <button type="button" onClick={cleanStateAndClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

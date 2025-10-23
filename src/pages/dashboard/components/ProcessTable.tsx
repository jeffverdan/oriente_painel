import { EditIcon, SearchIcon } from "@/lib/icons";
import { KeysStatus, Processo } from "@/types/processo";
import { useMemo, useState } from "react";
import ProcessoModal from "./ProcessoModal";
import { createProcesso, updateProcesso } from "@/lib/db/processos";
import { useProcessos } from '@/hooks/useProcessos'
import { createEmpresa } from "@/lib/db/empresas";
import SelectItem from "@/componentes/SelectItem/SelectItem";
import { toastEmitter } from "@/lib/functions";
import ChipCustom, { ChipColor } from "@/componentes/Chip/Chip";

const statusColors: Record<KeysStatus, ChipColor> = { 'Concluído': 'green', 'Em Andamento': 'sky', 'Aguardando Cliente': 'yellow', 'Cancelado': 'red' };
// const statusColors: Record<KeysStatus, string> = { 'Concluído': 'bg-amber-100 text-amber-800', 'Em Andamento': 'bg-sky-100 text-sky-800', 'Aguardando Cliente': 'bg-gray-100 text-gray-800', 'Cancelado': 'bg-red-100 text-red-800' };

export default function ProcessTable({ processos, refresh }: { processos: Processo[], refresh: () => Promise<void> }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [processoEmEdicao, setProcessoEmEdicao] = useState<Processo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [tipoFilter, setTipoFilter] = useState('');
    const { fetchProcessos } = useProcessos();

    const filteredProcessos = useMemo(() => {
        return processos?.filter(p =>
            p.empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter ? p.status.nome === statusFilter : true) &&
            (tipoFilter ? p.tipo_processo.nome === tipoFilter : true)
        );
    }, [processos, searchTerm, statusFilter, tipoFilter]);

    const uniqueStatuses = useMemo(() => [...new Set(processos?.map(p => p.status) || [])], [processos]);
    const uniqueTipos = useMemo(() => [...new Set(processos?.map(p => p.tipo_processo) || [])], [processos]);    

    const handleOpenAddModal = () => {
        setProcessoEmEdicao(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = async (processo: Processo) => {        
        setProcessoEmEdicao(processo);
        setIsModalOpen(true);
    };

    const handleSaveProcess = async (processoData: Partial<Processo>) => {
        console.log("Salvando processo: ", processoData);
        
        try {
            if (processoData.id) {
                await updateProcesso(processoData)
                toastEmitter('Processo atualizado com sucesso!', 'success')                
            } else {
                const empresa_id = processoData.empresa?.id;
                if (!empresa_id) {
                    const newEmpresa = await createEmpresa(processoData.empresa!);
                    processoData.empresa = newEmpresa;
                }

                await createProcesso(processoData);
                toastEmitter('Processo criado com sucesso!', 'success');
            }            
            setIsModalOpen(false);
            await refresh();
            // window.location.reload();
        } catch (err) {
            console.error(err)
            alert('Erro ao salvar processo: ' + err)
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 w-full lg:w-2/3">
            <ProcessoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProcess}
                processo={processoEmEdicao}
            />
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Lista de Processos</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => console.log("Atualizando dados...")} className="p-2 cursor-pointer rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600" title="Atualizar Dados"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M20 4h-5v5M4 20h5v-5" /></svg></button>
                    <button onClick={handleOpenAddModal} className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>Adicionar Processo</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400"><SearchIcon /></span>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar por empresa..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>                
                <SelectItem
                    label="Status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="Todos os Status"
                    phAtivo
                    options={uniqueStatuses.map(s => ({ id: s.id, label: s.nome, value: s.nome }))}
                />
                <SelectItem
                    label="Tipo de Processo"
                    value={tipoFilter}
                    onChange={setTipoFilter}
                    placeholder="Todos os Tipos"
                    phAtivo
                    options={uniqueTipos.map(t => ({ id: t.id, label: t.nome, value: t.nome }))}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 divide-y divide-gray-200" >
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50" style={{ borderColor: '#d4b477'}}>
                        <tr>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">ID</th>
                            <th scope="col" className="px-6 py-3">Empresa</th>
                            <th scope="col" className="px-6 py-3">Tipo</th>
                            <th scope="col" className="px-6 py-3">Responsável</th>
                            <th scope="col" className="px-6 py-3">Entrada Status</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProcessos?.map(proc => (
                            <tr key={proc.id} className="bg-white border-b border-gray-200 hover:bg-gray-100">
                                <td className="px-6 py-4 font-medium text-gray-900 hidden md:table-cell">{proc.id}</td>
                                <td className="px-6 py-4">{proc.empresa.nome}</td>
                                <td className="px-6 py-4">{proc.tipo_processo.nome}</td>
                                <td className="px-6 py-4">{proc.responsavel?.nome}</td>
                                <td className="px-6 py-4">{new Date(proc.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                                <td className="px-6 py-4"><ChipCustom label={proc.status.nome} colorType={statusColors[proc.status.nome]} /></td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleOpenEditModal(proc)} className="text-indigo-600 cursor-pointer  hover:text-indigo-900"><EditIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
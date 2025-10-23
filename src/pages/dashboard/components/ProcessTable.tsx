import { ChevronUpDownIcon, EditIcon, SearchIcon } from "@/lib/icons";
import { KeysStatus, Processo } from "@/types/processo";
import { useMemo, useState } from "react";
import { ProcessoModal } from "./ProcessoModal";
import { createProcesso, updateProcesso } from "@/lib/db/processos";
import { useProcessos } from '@/hooks/useProcessos'
import { createEmpresa } from "@/lib/db/empresas";

const statusColors: Record<KeysStatus, string> = { 'Concluído': 'bg-green-100 text-green-800', 'Em Andamento': 'bg-sky-100 text-sky-800', 'Aguardando Cliente': 'bg-yellow-100 text-yellow-800', 'Cancelado': 'bg-red-100 text-red-800' };
// const statusColors: Record<KeysStatus, string> = { 'Concluído': 'bg-amber-100 text-amber-800', 'Em Andamento': 'bg-sky-100 text-sky-800', 'Aguardando Cliente': 'bg-gray-100 text-gray-800', 'Cancelado': 'bg-red-100 text-red-800' };

export default function ProcessTable({ processos }: { processos: Processo[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [processoEmEdicao, setProcessoEmEdicao] = useState<Processo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [tipoFilter, setTipoFilter] = useState('');
    const { fetchProcessos } = useProcessos();

    const filteredProcessos = useMemo(() => {
        return processos.filter(p =>
            p.empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter ? p.status.nome === statusFilter : true) &&
            (tipoFilter ? p.tipo_processo.nome === tipoFilter : true)
        );
    }, [processos, searchTerm, statusFilter, tipoFilter]);

    const uniqueStatuses = useMemo(() => [...new Set(processos.map(p => p.status))], [processos]);
    const uniqueTipos = useMemo(() => [...new Set(processos.map(p => p.tipo_processo))], [processos]);

    const handleOpenAddModal = () => {
        setProcessoEmEdicao(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (processo: Processo) => {
        setProcessoEmEdicao(processo);
        setIsModalOpen(true);
    };

    const handleSaveProcess = async (processoData: Partial<Processo>) => {
        try {
            if (processoData.id) {
                await updateProcesso(processoData)
                alert('Processo atualizado com sucesso!')
            } else {
                const empresa_id = processoData.empresa?.id;
                if (!empresa_id) {
                    const newEmpresa = await createEmpresa(processoData.empresa!);
                    processoData.empresa = newEmpresa;
                }

                await createProcesso(processoData);

                alert('Processo criado com sucesso!')
            }
            fetchProcessos();
            setIsModalOpen(false)
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
                <div className="relative cursor-pointer">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400"><ChevronUpDownIcon /></span>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="select w-full cursor-pointer hover:bg-gray-50 hover:text-gray-700 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                        <option className="text-gray-500" value="">Todos os Status</option>
                        {uniqueStatuses.map(s => <option key={s.id} value={s.nome}>{s.nome} </option>)}
                    </select>
                </div>
                {/* <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="">Todos os Status</option>{uniqueStatuses.map(s => <option key={s.id} value={s.nome}>{s.nome}</option>)}</select> */}
                <select value={tipoFilter} onChange={e => setTipoFilter(e.target.value)} className="w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="">Todos os Tipos</option>{uniqueTipos.map(t => <option key={t.id} value={t.nome}>{t.nome}</option>)}</select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 divide-y divide-gray-200">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                        {filteredProcessos.map(proc => (
                            <tr key={proc.id} className="bg-white border-b border-gray-200 hover:bg-gray-100">
                                <td className="px-6 py-4 font-medium text-gray-900 hidden md:table-cell">{proc.id}</td>
                                <td className="px-6 py-4">{proc.empresa.nome}</td>
                                <td className="px-6 py-4">{proc.tipo_processo.nome}</td>
                                <td className="px-6 py-4">{proc.responsavel?.nome}</td>
                                <td className="px-6 py-4">{new Date(proc.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[proc.status.nome]}`}>{proc.status.nome}</span></td>
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
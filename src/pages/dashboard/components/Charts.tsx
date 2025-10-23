import { KeysStatus, Processo, } from "@/types/processo"
import { useMemo } from "react"
import { Bar, Pie } from 'react-chartjs-2';

// const statusChartColors: Record<KeysStatus, string> = { 'Concluído': 'rgba(22, 163, 74, 0.8)', 'Em Andamento': 'rgba(37, 99, 235, 0.8)', 'Aguardando Cliente': 'rgba(202, 138, 4, 0.8)', 'Cancelado': 'rgba(220, 38, 38, 0.8)' };
const statusChartColors: Record<KeysStatus, string> = { 'Concluído': 'rgba(217, 119, 6, 0.8)', 'Em Andamento': 'rgba(2, 132, 199, 0.8)', 'Aguardando Cliente': 'rgba(75, 85, 99, 0.8)', 'Cancelado': 'rgba(220, 38, 38, 0.8)' };

export default function Charts({ processos }: { processos: Processo[] }) {

    const chartData = useMemo(() => {
        if(processos) {
            const tipoCounts = processos.reduce((acc, p) => { 
                const tipoNome = p.tipo_processo.nome as string; 
                acc[tipoNome] = (acc[tipoNome] || 0) + 1; 
                return acc; 
            }, {} as Record<string, number>);
            const statusCounts = processos.reduce((acc, p) => { acc[p.status.nome] = (acc[p.status.nome] || 0) + 1; return acc; }, {} as Record<string, number>);
            const monthlyData = processos.reduce((acc, p) => { const month = new Date(p.data_inicio + 'T00:00:00').toLocaleString('pt-BR', { month: 'short', year: '2-digit' }); acc[month] = (acc[month] || 0) + 1; return acc; }, {} as Record<string, number>);
            const sortedMonthLabels = Object.keys(monthlyData || {}).sort((a, b) => { const [m1, y1] = a.split('/'); const [m2, y2] = b.split('/'); 
            const monthsOrder = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']; 
            const dateA = new Date(Number(`20${y1}`), monthsOrder.indexOf(m1.replace('.',''))); const dateB = new Date(Number(`20${y2}`), monthsOrder.indexOf(m2.replace('.',''))); return dateA.getTime() - dateB.getTime(); });
            const sortedMonthData = sortedMonthLabels.map(label => monthlyData[label]);
            return { tipo: { labels: Object.keys(tipoCounts), data: Object.values(tipoCounts) }, status: { labels: Object.keys(statusCounts), data: Object.values(statusCounts) }, timeline: { labels: sortedMonthLabels, data: sortedMonthData } };
        } else {
            return { tipo: { labels: [], data: [] }, status: { labels: [], data: [] }, timeline: { labels: [], data: [] } };
        }
    }, [processos]);

    return (
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Processos por Tipo</h3>
                <Bar data={{ labels: chartData.tipo.labels, datasets: [{ label: 'Nº de Processos', data: chartData.tipo.data, backgroundColor: 'rgba(28, 57, 142, 0.8)' }] }} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Distribuição por Status</h3>
                <Pie data={{ labels: chartData.status.labels, datasets: [{ data: chartData.status.data, backgroundColor: chartData.status.labels.map(label => statusChartColors[label as KeysStatus]), borderColor: '#fff', borderWidth: 2 }] }} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
        </div>
    )
}
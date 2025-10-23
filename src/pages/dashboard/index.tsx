'use client'

import HeadSeo from '@/componentes/HeadSeo/HeadSeo';
import { useEffect, useMemo, useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import { useProcessos } from '../../hooks/useProcessos'
import Sidebar from './components/Sidebar'
import { SummaryCard } from './components/SummaryCard'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { AlertTriangleIcon, CheckIcon, ClockIcon, ProcessosIcon } from '@/lib/icons'
import ProcessTable from './components/ProcessTable'
import Charts from './components/Charts'
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';
import { User } from '@supabase/supabase-js'


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)


export default function DashboardPage() {
    const { processos, loading  } = useProcessos();
    console.log(processos);
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
        async function check() {
            const { data } = await supabase.auth.getSession()
            if (!data.session) return router.push('/login')
            setUser(data.session.user);
            localStorage.setItem('user', JSON.stringify(data.session.user));
        }
        check();
        return () => {
            localStorage.removeItem('user');
         };
    }, [router]);

    if (loading) return <div className="p-10 text-gray-500">Carregando dados...</div>

    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">
            <HeadSeo titlePage='Dashboard' description='' />
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard de Processos</h1>
                    <p className="text-gray-500 mt-1">Acompanhe seus processos.</p>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <SummaryCard title="Total de Processos" value={processos.length} color="indigo" icon={<ProcessosIcon />} />
                    <SummaryCard title="Em Andamento" value={processos.filter(p => p.status?.nome === 'Em Andamento').length} color="blue" icon={<ClockIcon />} />
                    <SummaryCard title="Concluídos" value={processos.filter(p => p.status?.nome === 'Concluído').length} color="green" icon={<CheckIcon />} />
                    <SummaryCard title="Aguardando Cliente" value={processos.filter(p => p.status?.nome === 'Aguardando Cliente').length} color="yellow" icon={<AlertTriangleIcon />} />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <ProcessTable processos={processos} />
                    <Charts processos={processos} />
                </div>
            </main>
        </div>
    )
}
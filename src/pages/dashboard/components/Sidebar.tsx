'use client'

import { DashboardIcon, LogoutIcon } from '@/lib/icons';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/images/Oriente_Simbolo.svg';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

function NavItem({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
    const pathname = usePathname();
    const active = pathname?.startsWith(href);
    return (
        <Link
            href={href}
            className={`p-3 rounded-lg transition-colors ${active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                }`}
            title={label}
            aria-label={label}
        >
            <span className="text-xl" aria-hidden>
                {icon}
            </span>
        </Link>
    )
}



export default function Sidebar() {
    const router = useRouter();

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.push('/login')
    };

    return (
        <aside className="hidden md:flex h-screen w-20 flex-shrink-0 bg-blue-900 flex-col items-center py-6">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-white font-bold text-lg">
                <Image src={Logo} alt="Logo" width={32} height={32} />
            </div>
            <nav className="mt-10 flex flex-col items-center space-y-6">
                <NavItem href="/dashboard" label="Dashboard" icon={<DashboardIcon />} />
                {/* <NavItem href="/dashboard/processos" label="Processos" icon={"📁"} /> */}
                {/* <NavItem href="/dashboard/empresas" label="Empresas" icon={"🏢"} /> */}
            </nav>
            <div className="mt-auto">
                <Link  href="/dashboard" onClick={handleSignOut} className="p-3 text-blue-300 hover:text-white rounded-lg" title="Deslogar">
                    <LogoutIcon />
                </Link >
            </div>
        </aside>
    )
}
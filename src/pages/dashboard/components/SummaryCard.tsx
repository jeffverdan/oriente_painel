'use client'


interface Props {
    title: string
    value: number | string
    color?: 'indigo' | 'blue' | 'green' | 'yellow' | 'gray'
    icon?: React.ReactNode
    hint?: string
}


export function SummaryCard({ title, value, color = 'gray', icon, hint }: Props) {
    const colorClasses = {
        indigo: { text: 'text-indigo-700', bg: 'bg-indigo-100' },
        blue: { text: 'text-sky-800', bg: 'bg-sky-100' },
        green: { text: 'text-green-700', bg: 'bg-green-100' },
        yellow: { text: 'text-yellow-700', bg: 'bg-yellow-100' },
        gray: { text: 'text-gray-900', bg: 'bg-gray-100' },
    } as const
    const selected = colorClasses[color]


    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    {hint && (
                        <span className="text-xs text-gray-400" title={hint} aria-label={hint}>
                            ⓘ
                        </span>
                    )}
                </div>
                <p className={`text-3xl font-bold mt-1 ${selected.text}`}>{value}</p>
            </div>
            {icon && <div className={`${selected.bg} ${selected.text} p-3 rounded-full`}>{icon}</div>}
        </div>
    )
}
import React, { useState, useMemo } from 'react';
import Icon from '../common/Icon';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityData } from '../../utils/activity-api';
import type { DateRange } from '../common/DateRangePicker';

const StatCard: React.FC<{ icon: string, label: string, value: string | number, isLoading: boolean }> = ({ icon, label, value, isLoading }) => (
    <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-quility-light-green">
            <Icon name={icon} size={20} className="text-quility-dark-green" />
        </div>
        <div>
            {isLoading ? (
                 <div className="w-12 h-6 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
                <p className="text-xl font-bold text-quility-dark-text">{value}</p>
            )}
            <p className="text-xs text-quility-dark-grey">{label}</p>
        </div>
    </div>
);


const StatsOverviewWidget: React.FC = () => {
    const [dateRange, setDateRange] = useState<DateRange>('today');

    const { data: activityData, isLoading } = useQuery({
        queryKey: ['activityData', dateRange],
        queryFn: () => fetchActivityData(dateRange),
    });

    const stats = useMemo(() => {
        if (!activityData) return { dials: 0, contacts: 0, appointments: 0, contactRate: '0%' };

        const dials = activityData.dials.reduce((sum, d) => sum + Number(d.callsMade), 0);
        const contacts = activityData.dials.reduce((sum, d) => sum + Number(d.contacts), 0);
        const appointments = Number(activityData.appointments || 0);
        const contactRate = dials > 0 ? `${((contacts / dials) * 100).toFixed(0)}%` : '0%';

        return { dials, contacts, appointments, contactRate };
    }, [activityData]);

    const ranges: { value: DateRange; label: string }[] = [
        { value: 'today', label: 'Today' },
        { value: '7', label: '7D' },
        { value: 'month', label: 'MTD' },
    ];

    return (
        <div className="bg-white rounded-lg border border-quility-border shadow-sm">
             <header className="p-4 border-b border-quility-border flex justify-between items-center">
                <h3 className="font-bold text-quility-dark-text">Stats Overview</h3>
                <div className="flex items-center text-xs border-2 border-quility-border rounded-lg p-0.5">
                    {ranges.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setDateRange(value)}
                            className={`px-2 py-1 rounded-md font-semibold transition-colors ${dateRange === value ? 'bg-quility-dark-green text-white shadow-inner' : 'text-quility-dark-grey hover:bg-quility-accent-bg'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </header>
            <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-2">
                <StatCard icon="q-phone-call" label="Dials" value={stats.dials} isLoading={isLoading} />
                <StatCard icon="q-leads" label="Contacts" value={stats.contacts} isLoading={isLoading} />
                <StatCard icon="calendar-clock" label="Appointments" value={stats.appointments} isLoading={isLoading} />
                <StatCard icon="activity-q" label="Contact Rate" value={stats.contactRate} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default StatsOverviewWidget;
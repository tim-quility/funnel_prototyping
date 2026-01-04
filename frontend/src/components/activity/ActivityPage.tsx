import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import Icon from '../common/Icon';
import DateRangePicker, { DateRange } from '../common/DateRangePicker';
import ActivityStatCard from './ActivityStatCard';
import SimpleLineChart from '../charts/SimpleLineChart';
import DoughnutChart from '../charts/DoughnutChart';
import ActivityFeed from './ActivityFeed';
import { useTheme } from '../../context/ThemeContext';
import { themes } from '../../themes';
import type { ChartDataPoint, AgentActivity } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityData } from '../../utils/activity-api';
import PersonalGoalsSection from '../goals/PersonalGoalsSection';

const emptyAgentActivity: AgentActivity = {
    // Arrays
    dials: [],
    scheduled: [],
    scheduledCalls: [],
    statusChange: [],
    applications: [],
    unreadMessages: [],
    leadsPurchased: [],

    // Totals / aggregated fields
    totalDials: 0,
    totalContacts: 0,
    totalApv: 0,
    totalLeadsPurchased: 0,
    contactRate: 0,
    appointmentRate: 0,

    // Other numeric fields
    appointments: 0,
};

const ActivityPage: React.FC = () => {
    const { agent } = useAuth();
    const [dateRange, setDateRange] = useState<DateRange>('today');
    const [customStartDate, setCustomStartDate] = useState<Date>(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d;
    });
    const [customEndDate, setCustomEndDate] = useState<Date>(new Date());
    const [lineChartMetric, setLineChartMetric] = useState<'dials' | 'leadsPurchased'>('dials');
    const { theme } = useTheme();

    const activeTheme = themes.find(t => t.id === theme) || themes[0];
    const colors = {
        dials: activeTheme.colors['quility-default'] || '#45bcaa',
        contacts: activeTheme.colors['quility-dark-green'] || '#005851',
    };

    const { data: agentActivity = emptyAgentActivity, isLoading, isError, error } = useQuery<AgentActivity, Error>({
        queryKey: ['activityData', dateRange, customStartDate, customEndDate],
        queryFn: () => fetchActivityData(dateRange, customStartDate, customEndDate),
        enabled: !!agent,
    });

    const stats = useMemo(() => {
        const dials = agentActivity.dials.reduce((sum, d) => sum + parseInt(String(d.callsMade), 10), 0);
        const contacts = agentActivity.dials.reduce((sum, d) => sum + Number(d.contacts || 0), 0);
        const leadsPurchased = agentActivity.leadsPurchased.reduce((sum, p) => sum + p.count, 0);
        const appointments = agentActivity.scheduled.length;
        const contactRate = dials > 0 ? ((contacts / dials) * 100).toFixed(0) + '%' : '0%';

        return { dials, contacts, leadsPurchased, appointments, contactRate };
    }, [agentActivity]);
    agentActivity;

    
    const lineChartData: ChartDataPoint[] = useMemo(() => {
        const dataMap: { [key: string]: number } = {};
        const sourceData = lineChartMetric === 'dials' ? agentActivity.dials : agentActivity.leadsPurchased;
        const dateKey = lineChartMetric === 'dials' ? 'dialDate' : 'purchaseDate';
        const valueKey = lineChartMetric === 'dials' ? 'callsMade' : 'count';
        
        sourceData.forEach((item: any) => {
            const date = new Date(item[dateKey]).toLocaleDateString();
            dataMap[date] = (dataMap[date] || 0) + parseInt(String(item[valueKey]), 10);
        });
        
        return Object.entries(dataMap)
            .map(([label, value]) => ({ label: new Date(label).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit'}), value }))
            .sort((a,b) => new Date(a.label).getTime() - new Date(b.label).getTime());

    }, [agentActivity, lineChartMetric]);
    
    const doughnutChartData = [
        { label: 'Contacts', value: stats.contacts, color: colors.contacts },
        { label: 'No Contact', value: stats.dials - stats.contacts, color: '#e4e4e4' }
    ];

    if (!agent) return null;

    return (
        <div className="p-4 md:p-8 space-y-8">
             <PersonalGoalsSection />

             <div className="border-t border-quility-border my-8"></div>
             <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center">
                    <Icon name="activity-q" size={26} className="text-quility-dark-text" />
                    <h1 className="text-2xl font-bold text-quility-dark-text ml-3">My Activity</h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <DateRangePicker selectedRange={dateRange} onRangeChange={setDateRange} />
                    {dateRange === 'custom' && (
                        <div className="flex items-center gap-2 bg-white border border-quility-border rounded-lg p-1">
                             <input 
                                type="date" 
                                value={customStartDate.toISOString().split('T')[0]} 
                                onChange={e => setCustomStartDate(new Date(e.target.value + 'T00:00:00'))}
                                className="p-1.5 text-sm font-semibold rounded-md border border-quility-border bg-quility-input-bg focus:outline-none focus:ring-2 focus:ring-quility/50"
                            />
                            <span className="text-sm font-semibold text-quility-dark-grey">to</span>
                             <input 
                                type="date" 
                                value={customEndDate.toISOString().split('T')[0]} 
                                onChange={e => {
                                    const date = new Date(e.target.value + 'T00:00:00');
                                    date.setHours(23, 59, 59, 999);
                                    setCustomEndDate(date);
                                }}
                                className="p-1.5 text-sm font-semibold rounded-md border border-quility-border bg-quility-input-bg focus:outline-none focus:ring-2 focus:ring-quility/50"
                            />
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-quility-dark-grey">Loading activity data...</div>
            ) : isError ? (
                 <div className="text-center py-10 text-red-500">Error loading data: {error.message}</div>
            ) : (
            <>
                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <ActivityStatCard icon="q-phone-call" label="Total Dials" value={stats.dials} />
                    <ActivityStatCard icon="q-leads" label="Total Contacts" value={stats.contacts} />
                    <ActivityStatCard icon="q-team" label="Contact Rate" value={stats.contactRate} />
                    <ActivityStatCard icon="calendar-clock" label="Appointments Set" value={stats.appointments} />
                    <ActivityStatCard icon="q-shopping" label="Leads Purchased" value={stats.leadsPurchased} />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-quility-border">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-quility-dark-text">Performance Over Time</h2>
                            <div className="flex items-center text-sm border-2 border-quility-border rounded-lg p-0.5">
                                <button onClick={() => setLineChartMetric('dials')} className={`px-3 py-1 rounded-md font-semibold transition-colors ${lineChartMetric === 'dials' ? 'bg-quility-dark-green text-white shadow-inner' : 'text-quility-dark-grey hover:bg-quility-accent-bg'}`}>Dials</button>
                                <button onClick={() => setLineChartMetric('leadsPurchased')} className={`px-3 py-1 rounded-md font-semibold transition-colors ${lineChartMetric === 'leadsPurchased' ? 'bg-quility-dark-green text-white shadow-inner' : 'text-quility-dark-grey hover:bg-quility-accent-bg'}`}>Leads</button>
                            </div>
                        </div>
                        <div className="h-64">
                            <SimpleLineChart data={lineChartData} />
                        </div>
                    </div>
                     <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-quility-border">
                        <h2 className="text-lg font-bold text-quility-dark-text mb-4">Call Outcomes</h2>
                        <DoughnutChart data={doughnutChartData} />
                    </div>
                </div>
                
                {/* Activity Feed */}
                <ActivityFeed activity={agentActivity} />
            </>
            )}
        </div>
    );
};

export default ActivityPage;
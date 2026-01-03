import React from 'react';
import Icon from '../common/Icon';
import Spinner from '../common/Spinner';
import { useQuery } from '@tanstack/react-query';
import { fetchRecentActivity } from '../../utils/activity-api';
import { formatDistanceToNow } from '../../utils/formatters';
import type { ActivityFeedItem, Lead } from '../../types';

interface ActivityFeedWidgetProps {
    fetchPage: (page: string) => void;
    onViewLead: (lead: Lead) => void; // Assuming a way to view lead details
}

const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ fetchPage, onViewLead }) => {
    const { data: activities, isLoading, isError } = useQuery<ActivityFeedItem[], Error>({
        queryKey: ['recentActivity'],
        queryFn: fetchRecentActivity,
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    const renderActivityContent = (item: ActivityFeedItem) => {
        const leadLink = item.leadId && item.leadName ? (
            <button
                onClick={() => onViewLead({ lead_id: item.leadId.toString() } as Lead)}
                className="font-bold hover:underline"
            >
                {item.leadName}
            </button>
        ) : <span className="font-bold">a lead</span>;

        switch (item.type) {
            case 'DIAL':
                return <>Made {item.details.calls} dials to {leadLink}.</>;
            case 'STATUS_CHANGE':
                return <>Status for {leadLink} changed to <span className="font-bold">{item.details.status}</span>.</>;
            case 'APPOINTMENT':
                return <>Set an appointment with {leadLink}: <span className="italic">"{item.details.title}"</span>.</>;
            default:
                return 'An unknown activity occurred.';
        }
    };

    const iconMap: { [key in ActivityFeedItem['type']]: string } = {
        DIAL: 'q-phone-call',
        STATUS_CHANGE: 'q-switch-vertical',
        APPOINTMENT: 'calendar-clock',
        LEAD_PURCHASE: 'q-shopping',
        VOICEMAIL: 'q-voicemail',
        NOTE: 'q-pencil'
    };

    return (
        <div className="bg-white rounded-lg border border-quility-border shadow-sm flex flex-col">
            <header className="p-4 border-b border-quility-border flex justify-between items-center">
                <h3 className="font-bold text-quility-dark-text">Recent Activity</h3>
                <button onClick={() => fetchPage('Activity')} className="text-xs font-bold text-quility hover:underline">View All</button>
            </header>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {isLoading ? <Spinner /> :
                    isError ? <p className="text-sm text-red-500">Could not load activity.</p> :
                    activities && activities.length > 0 ? (
                        activities.slice(0, 20).map(item => (
                            <div key={item.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 flex-shrink-0 bg-quility-accent-bg rounded-full flex items-center justify-center">
                                    <Icon name={iconMap[item.type] || 'activity-q'} size={16} className="text-quility-dark-text" />
                                </div>
                                <div>
                                    <p className="text-sm text-quility-dark-text">{renderActivityContent(item)}</p>
                                    {/* Ensure item.timestamp is passed directly for proper date conversion */}
                                    <p className="text-xs text-quility-dark-grey">{formatDistanceToNow(item.timestamp)}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-center text-quility-dark-grey py-8">No recent activity.</p>
                    )
                }
            </div>
        </div>
    );
};

export default ActivityFeedWidget;
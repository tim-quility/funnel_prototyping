
import React from 'react';
import type { Lead } from '../../../../types';
import Icon from '../../../common/Icon';
import { formatDistanceToNow } from '../../../../utils/formatters';

interface ActivityLogBlockProps {
    lead: Lead;
    onUpdateLead?: (updates: Partial<Lead>) => void; // Prop is optional now
}

// Mocked lead activity for demonstration
const mockLeadActivity = [
    { id: 'act_1', type: 'Call', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), description: 'Made 3 dials, 1 contact' },
    { id: 'act_2', type: 'Email', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), description: 'Sent "Follow-up" email' },
    { id: 'act_3', type: 'Status Change', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), description: 'Status changed to "Contacted"' },
    { id: 'act_4', type: 'Note', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), description: 'Added a new note.' },
    { id: 'act_5', type: 'Text', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), description: 'Sent "Appointment Reminder" text.' },
];

const ActivityLogBlock: React.FC<ActivityLogBlockProps> = ({ lead }) => {
    const iconMap: { [key: string]: string } = {
        Call: 'q-phone-call',
        Email: 'q-email',
        'Status Change': 'q-switch-vertical',
        Text: 'message-circle-q',
        Note: 'q-pencil',
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-quility-border shadow-sm">
            <h3 className="font-bold text-quility-dark-text mb-3">Activity Log</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {mockLeadActivity.length > 0 ? (
                    mockLeadActivity.map(activity => (
                        <div key={activity.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 flex-shrink-0 bg-quility-accent-bg rounded-full flex items-center justify-center">
                                <Icon name={iconMap[activity.type] || 'activity-q'} size={16} className="text-quility-dark-text" />
                            </div>
                            <div>
                                <p className="text-sm text-quility-dark-text">{activity.description}</p>
                                <p className="text-xs text-quility-dark-grey">{formatDistanceToNow(new Date(activity.timestamp))}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <Icon name="activity-q" size={32} className="mx-auto text-quility-dark-grey/30" />
                        <p className="text-sm text-quility-dark-grey mt-2">No activity recorded for this lead yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLogBlock;

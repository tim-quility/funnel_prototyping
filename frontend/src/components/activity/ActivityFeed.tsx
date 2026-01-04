import React, { useMemo } from 'react';
import Icon from '../common/Icon';
import type { AgentActivity } from '../../types';

interface ActivityFeedProps {
  activity: AgentActivity;
}

const FeedItem: React.FC<{ icon: string; children: React.ReactNode; }> = ({ icon, children }) => (
    <div className="flex items-start gap-3 p-3 hover:bg-quility-light-hover rounded-md border-b border-quility-border last:border-b-0">
        <Icon name={icon} size={20} className="text-quility-dark-grey mt-1 flex-shrink-0" />
        <div className="text-sm text-quility-dark-text">{children}</div>
    </div>
);

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activity }) => {

    const combinedFeed = useMemo(() => {
        const items: { date: Date; icon: string; content: React.ReactNode; id: string }[] = [];

        activity.dials.forEach((item, i) => items.push({
            id: `dial-${i}-${item.dialDate}`,
            date: new Date(item.dialDate),
            icon: 'q-phone-call',
            content: <>Made <span className="font-semibold">{item.callsMade} dials</span> with <span className="font-semibold">{item.contacts} contacts</span>.</>
        }));
        
        activity.leadsPurchased.forEach((item, i) => items.push({
            id: `lead-${i}-${item.purchaseDate}`,
            date: new Date(item.purchaseDate),
            icon: 'q-shopping',
            content: <>Purchased <span className="font-semibold">{item.count} leads</span>.</>
        }));

        activity.unreadMessages.forEach((item, i) => items.push({
            id: `msg-${i}-${item.unreadMessageTime}`,
            date: new Date(item.unreadMessageTime * 1000),
            icon: 'message-circle-q',
            content: <>Received a new message from <span className="font-semibold">{item.unreadLeadFirst} {item.unreadLeadLast}</span>: "{item.unreadMessage}".</>
        }));

        activity.scheduled.forEach((item, i) => items.push({
            id: `appt-${i}-${item.apptDate}`,
            date: new Date(item.apptDate * 1000),
            icon: 'calendar-clock',
            content: <>Appointment scheduled: <span className="font-semibold">{item.apptTitle}</span>.</>
        }));
        
        activity.scheduledCalls.forEach((item, i) => items.push({
            id: `call-${i}-${item.schedTime}`,
            date: new Date(item.schedTime * 1000),
            icon: 'q-phone-call',
            content: <>Callback scheduled with <span className="font-semibold">{item.schedLeadFirst} {item.schedLeadLast}</span>.</>
        }));

        activity.statusChange.forEach((item, i) => items.push({
            id: `status-${i}-${item.statusDate}`,
            date: new Date(item.statusDate * 1000),
            icon: 'q-switch-vertical',
            content: <><span className="font-semibold">{item.statusChangeFirst} {item.statusChangeLast}</span>'s status changed to <span className="font-semibold">{item.statusName}</span>.</>
        }));

        activity.applications.forEach((item, i) => items.push({
            id: `app-${i}-${item.statusDate}`,
            date: new Date(item.statusDate * 1000),
            icon: 'file-chart-q',
            content: <>Application sent to <span className="font-semibold">{item.statusChangeFirst} {item.statusChangeLast}</span>.</>
        }));

        return items.sort((a, b) => b.date.getTime() - a.date.getTime());

    }, [activity]);
    return (
        <div className="bg-white p-6 rounded-lg border border-quility-border">
            <h2 className="text-lg font-bold text-quility-dark-text mb-4">Activity Feed</h2>
            <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
                {combinedFeed.length > 0 ? (
                    combinedFeed.map(item => (
                        <FeedItem key={item.id} icon={item.icon}>
                            {item.content}
                            <span className="text-quility-dark-grey ml-2 text-xs font-medium">({item.date.toLocaleString().split(",")[0]})</span>
                        </FeedItem>
                    ))
                ) : (
                    <p className="text-center text-quility-dark-grey py-10">No activities found for the selected period.</p>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
import React from 'react';
import ActivityStatCard from '../activity/ActivityStatCard';
import SimpleLineChart from '../charts/SimpleLineChart';
import type { ChartDataPoint, Badge as BadgeType, Recruit, RecruitingBadge } from '../../types';
import Badge from '../common/Badge';
import { mockRecruitingBadges } from '../../constants';
import ConfettiOverlay from '../common/ConfettiOverlay';
import NewBadgeAlert from './NewBadgeAlert';

interface RecruitingDashboardProps {
    recruits: Recruit[];
    earnedBadges:RecruitingBadge[];
    handleDismissBadgeAlert:(badgeId: string) => void;
    unviewedEarnedBadges:RecruitingBadge[];
}

const RecruitingDashboard: React.FC<RecruitingDashboardProps> = ({ earnedBadges, recruits, handleDismissBadgeAlert, unviewedEarnedBadges }) => {
    // Data processing now uses passed-in props
    const recruitsThisMonth = recruits.filter(r => new Date(r.applyDate) >= new Date(new Date().setDate(1))).length;
    const totalDownline = recruits.length;
    const pendingInvites = 2; // Still hardcoded mock
    const contractedThisMonth = recruits.filter(r => r.stage === 'contracted' && new Date(r.applyDate) >= new Date(new Date().setDate(1))).length;

    const recruitGrowthData: ChartDataPoint[] = (() => {
        const dataMap: { [key: string]: number } = {};
        recruits.forEach(recruit => {
            const month = new Date(recruit.applyDate).toLocaleString('default', { month: 'short' });
            dataMap[month] = (dataMap[month] || 0) + 1;
        });
        const sortedMonths = Object.keys(dataMap).sort((a, b) => new Date(`1 ${a} 2000`).getTime() - new Date(`1 ${b} 2000`).getTime());
        return sortedMonths.map(month => ({ label: month, value: dataMap[month] }));
    })();

    const recentAchievements = mockRecruitingBadges.filter(b => b.earned);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <ActivityStatCard icon="plus-circle" label="New Recruits This Month" value={recruitsThisMonth} />
                <ActivityStatCard icon="team" label="Total Downline" value={totalDownline} />
                <ActivityStatCard icon="q-email" label="Pending Invitations" value={pendingInvites} />
                <ActivityStatCard icon="checkmark-q" label="Contracted This Month" value={contractedThisMonth} />
            </div>

            <div className="bg-white p-6 rounded-lg border border-quility-border">
                <h2 className="text-lg font-bold text-quility-dark-text mb-4">Recruit Growth Over Time</h2>
                <div className="h-64">
                    <SimpleLineChart data={recruitGrowthData} />
                </div>
            </div>
            {unviewedEarnedBadges.length > 0 && (
                <>
                    <div className="mt-6 fl">
                        <ConfettiOverlay/>
                    </div>
                    {unviewedEarnedBadges.map(badge => (
                        <NewBadgeAlert
                            key={badge.id}
                            badge={badge}
                            onDismiss={() => handleDismissBadgeAlert(badge.id)}
                        />
                    ))}
                </>
            )}
            
            <div>
                <h2 className="text-lg font-bold text-quility-dark-text mb-4"></h2>
                {recentAchievements.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {earnedBadges.length > 0 ? (
                            earnedBadges.map(badge => (
                                <Badge key={badge.id} badge={badge} />
                            ))
                        ) : (
                            <div>No badges earned yet.</div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg border border-quility-border text-center text-quility-dark-grey">
                        <p>Start recruiting to earn your first badge!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// FIX: Added default export
export default RecruitingDashboard;
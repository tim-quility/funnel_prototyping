import React from 'react';
import Badge from '../common/Badge';
import type { RecruitingBadge as BadgeType } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchRecruitingBadges } from '../../utils/recruiting-api';

const RecruitingBadgesPage: React.FC = () => {
    const { data: badges = [], isLoading, isError, error } = useQuery<BadgeType[], Error>({
        queryKey: ['recruitingBadges'],
        queryFn: fetchRecruitingBadges,
    });

    if (isLoading) {
        return <div className="text-center py-10 text-quility-dark-grey">Loading badges...</div>;
    }

    if (isError) {
        return <div className="text-center py-10 text-red-500">Error loading badges: {error.message}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg border border-quility-border">
            <h2 className="text-xl font-bold text-quility-dark-text mb-1">Recruiting Badges</h2>
            <p className="text-quility-dark-grey mb-6">Recognize your recruiting achievements. Here are all the badges you can earn.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {badges.map(badge => (
                    <Badge key={badge.id} badge={badge as any} />
                ))}
            </div>
        </div>
    );
};

export default RecruitingBadgesPage;
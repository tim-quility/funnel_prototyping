import React, { useState } from 'react';
import Icon from '../common/Icon';
import CreateJobFeedModal from './CreateJobFeedModal';
import PrimaryButton from '../common/PrimaryButton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJobFeeds, deleteJobFeed } from '../../utils/recruiting-api';
import type { JobFeed, JobPostTemplate } from '../../types';
import Spinner from '../common/Spinner';

interface JobFeedsPageProps {
    jobPostTemplates: JobPostTemplate[];
}

const JobFeedsPage: React.FC<JobFeedsPageProps> = ({ jobPostTemplates }) => {
    const queryClient = useQueryClient();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: feeds = [], isLoading, isError } = useQuery<JobFeed[], Error>({
        queryKey: ['jobFeeds'],
        queryFn: fetchJobFeeds,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteJobFeed,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobFeeds'] });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this feed?')) {
            deleteMutation.mutate(id);
        }
    };

    const copyLink = (id: string) => {
        // In dev/prod this would be the actual full URL
        const url = `${window.location.origin}/api/recruiting/feeds/${id}/xml`;
        navigator.clipboard.writeText(url);
        alert('Feed URL copied to clipboard!');
    };

    if (isLoading) return <div className="text-center py-10"><Spinner /></div>;
    if (isError) return <div className="text-center py-10 text-red-500">Error loading feeds.</div>;

    return (
        <div className="bg-white p-6 rounded-lg border border-quility-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-quility-dark-text">Job XML Feeds</h2>
                    <p className="text-quility-dark-grey mt-1">
                        Create automated job feeds targeting multiple cities to distribute to job boards.
                    </p>
                </div>
                <PrimaryButton 
                    onClick={() => setIsCreateModalOpen(true)}
                    label="Create New Feed"
                    leftIcon="plus"
                />
            </div>

            {feeds.length === 0 ? (
                <div className="text-center py-16 text-quility-dark-grey bg-quility-accent-bg rounded-lg">
                    <Icon name="share" size={48} className="mx-auto opacity-30 mb-4" />
                    <h3 className="text-lg font-bold">No Active Feeds</h3>
                    <p>Create a feed to mass-distribute your job posts.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {feeds.map(feed => (
                        <div key={feed.id} className="p-4 border border-quility-border rounded-lg hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-lg text-quility-dark-text">{feed.title}</h3>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                                        {feed.jobType}
                                    </span>
                                </div>
                                <p className="text-sm text-quility-dark-grey mt-1">
                                    Targeting <span className="font-bold text-quility-dark-text">{feed.targets.length}</span> cities
                                    {feed.salaryRange && <span> • {feed.salaryRange}</span>}
                                </p>
                                <div className="flex gap-1 mt-2">
                                    {feed.targets.slice(0, 5).map((t, i) => (
                                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                            {t.city}, {t.state}
                                        </span>
                                    ))}
                                    {feed.targets.length > 5 && <span className="text-xs text-gray-500">+{feed.targets.length - 5} more</span>}
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => copyLink(feed.id)}
                                    className="px-3 py-1.5 text-sm font-semibold border-2 border-quility-border rounded-md hover:bg-quility-accent-bg flex items-center gap-2"
                                >
                                    <Icon name="copy-q" size={16} /> Copy XML Link
                                </button>
                                <button 
                                    onClick={() => handleDelete(feed.id)}
                                    className="p-2 text-quility-destructive hover:bg-red-50 rounded-md"
                                >
                                    <Icon name="trash-q" size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isCreateModalOpen && (
                <CreateJobFeedModal 
                    onClose={() => setIsCreateModalOpen(false)} 
                    templates={jobPostTemplates}
                />
            )}
        </div>
    );
};

export default JobFeedsPage;
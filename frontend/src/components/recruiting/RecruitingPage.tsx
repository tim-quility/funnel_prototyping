
import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon';
import RecruitingDashboard from './RecruitingDashboard';
import RecruitsPipeline from './RecruitsPipeline';
import RecruitingResources from './RecruitingResources';
import JobPostsPage from './JobPostsPage';
import RecruitingUpsell from './RecruitingUpsell';
import { useAuth } from '../../context/AuthContext';
import RecruitingBadgesPage from './RecruitingBadgesPage';
import JobFeedsPage from './JobFeedsPage'; // New Import
// New imports for API integration
import Toast from '../common/Toast';
import PaymentConfirmationModal from '../purchaseModal/PaymentConfirmationModal';
import { mockMarketplaceServices, mockPaymentMethods } from '../../constants';
import type { MarketplaceItem, RecruitingBadge } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchRecruitingData, fetchRecruitingBadges } from '../../utils/recruiting-api';

type RecruitingTab = 'dashboard' | 'pipeline' | 'resources' | 'posts' | 'badges' | 'feeds';

//const SEEN_RECRUITING_BADGES_KEY = 'funnel-seen-recruiting-badges';

const RecruitingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<RecruitingTab>('dashboard');
    const { agent, activateRecruitingModule } = useAuth();
    console.log(agent)
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    interface PaymentConfirmationConfig {
        item: MarketplaceItem;
        totalPrice: number;
        onConfirm: (paymentMethodId: string) => void;
        confirmButtonText?: string;
    }
    const [paymentConfirmationConfig, setPaymentConfirmationConfig] = useState<PaymentConfirmationConfig | null>(null);
    const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<RecruitingBadge[]>([]);
    /*const [dismissedBadgeIds, setDismissedBadgeIds] = useState<Set<string>>(() => {
        const saved = localStorage.getItem(SEEN_RECRUITING_BADGES_KEY);
        return new Set(saved ? JSON.parse(saved) : []);
    });
*/
    // Fetch all recruiting data here
    const { data: recruitingData, isLoading, isError, error } = useQuery({
        queryKey: ['recruitingData'],
        queryFn: fetchRecruitingData,
        enabled: !!agent && !!agent.recruitingModuleActive, // Only fetch if the module is active
    });

    // Fetch recruiting badges to check for new ones
    const { data: recruitingBadges = [], isLoading: badgesLoading, isError: badgesError } = useQuery<RecruitingBadge[], Error>({
        queryKey: ['recruitingBadges'],
        queryFn: fetchRecruitingBadges,
        enabled: !!agent && !!agent.recruitingModuleActive, // Only fetch if the module is active
    });
    const unviewedEarnedBadges = recruitingBadges.filter(
        b => b.earned === true && b.viewed === 0
    );
    const earnedBadges = recruitingBadges.filter(
        b => b.earned === true
    );


    // Effect to detect and display newly earned badges
    /*useEffect(() => {
        if (!badgesLoading && !badgesError && recruitingBadges.length > 0) {
            const earnedButUnseen = recruitingBadges.filter(
                badge => badge.earned && !dismissedBadgeIds.has(badge.id)
            );
            setNewlyEarnedBadges(earnedButUnseen);
        }
    }, [recruitingBadges, badgesLoading, badgesError, dismissedBadgeIds]);*/

    const handleDismissBadgeAlert = (badgeId: string) => {
       /* setDismissedBadgeIds(prev => {
            const newSet = new Set(prev);
            newSet.add(badgeId);
            //localStorage.setItem(SEEN_RECRUITING_BADGES_KEY, JSON.stringify(Array.from(newSet)));
            return newSet;
        });*/
        setNewlyEarnedBadges(prev => prev.filter(badge => badge.id !== badgeId));
    };


    if (!agent) return null;

    // Upsell/Activation Flow
    if (!agent.recruitingModuleActive) {
        const handleActivate = () => {
            const recruitingService = mockMarketplaceServices.find(item => item.id === 'service_2');
            if (recruitingService && typeof recruitingService.price === 'number') {
                setPaymentConfirmationConfig({
                    item: recruitingService,
                    totalPrice: recruitingService.price,
                    confirmButtonText: `Confirm Subscription ($${recruitingService.price}/mo)`,
                    onConfirm: (paymentMethodId: string) => {
                        console.log(`Subscribing with payment method: ${paymentMethodId}`);
                        activateRecruitingModule();
                        setPaymentConfirmationConfig(null);
                        setToastMessage('Recruiting module activated!');
                    }
                });
            }
        };

        return (
            <>
                <RecruitingUpsell onActivate={handleActivate} />
                <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
                {paymentConfirmationConfig && (
                    <PaymentConfirmationModal
                        itemName={paymentConfirmationConfig.item.name}
                        totalPrice={paymentConfirmationConfig.totalPrice}
                        paymentMethods={mockPaymentMethods}
                        onConfirm={paymentConfirmationConfig.onConfirm}
                        onClose={() => setPaymentConfirmationConfig(null)}
                        confirmButtonText={paymentConfirmationConfig.confirmButtonText}
                    />
                )}
            </>
        );
    }

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center py-10 text-quility-dark-grey">Loading recruiting data...</div>;
        }
        if (isError) {
            return <div className="text-center py-10 text-red-500">Error loading data: {error.message}</div>;
        }
        
        switch (activeTab) {
            case 'dashboard':
                return <RecruitingDashboard earnedBadges={earnedBadges} recruits={recruitingData?.recruits || []} handleDismissBadgeAlert={handleDismissBadgeAlert} unviewedEarnedBadges={unviewedEarnedBadges}/>;
            case 'pipeline':
                return <RecruitsPipeline 
                            initialRecruits={recruitingData?.recruits || []} 
                            initialPipelines={recruitingData?.pipelines || []} 
                            defaultRecruitStageId={recruitingData?.defaultRecruitStageId || null}
                        />;
            case 'resources':
                return <RecruitingResources 
                            initialResources={recruitingData?.recruitingResources || []}
                            initialPackets={recruitingData?.resourcePackets || []}
                        />;
            case 'posts':
                return <JobPostsPage initialTemplates={recruitingData?.jobPostTemplates || []} />;
            case 'feeds': // New case
                return <JobFeedsPage jobPostTemplates={recruitingData?.jobPostTemplates || []} />;
            case 'badges':
                return <RecruitingBadgesPage />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ tab: RecruitingTab, label: string, icon: string }> = ({ tab, label, icon }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-4 transition-colors 
                ${activeTab === tab 
                    ? 'border-quility text-quility' 
                    : 'border-transparent text-quility-dark-grey hover:text-quility-dark-text'
                }`}
        >
            <Icon name={icon} size={18} />
            {label}
        </button>
    );

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex items-center">
                <Icon name="recruiting" size={26} className="text-quility-dark-text" />
                <h1 className="text-2xl font-bold text-quility-dark-text ml-3">Recruiting Center</h1>
            </div>

             <div className="border-b border-quility-border">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <TabButton tab="dashboard" label="Dashboard" icon="dashboard-q" />
                    <TabButton tab="pipeline" label="Pipeline" icon="q-dataflow-1" />
                    <TabButton tab="resources" label="Resources" icon="book-open" />
                    <TabButton tab="posts" label="Job Posts" icon="briefcase" />
                    <TabButton tab="feeds" label="XML Feeds" icon="share" />
                    <TabButton tab="badges" label="Badges" icon="trophy" />
                </nav>
            </div>
            
            <div className="mt-6 fl">

                {renderContent()}
            </div>


                

        </div>
    );
};
// FIX: Added default export
export default RecruitingPage;

import React from 'react';
import Icon from '../common/Icon';

interface RecruitingUpsellProps {
    onActivate: () => void;
}

const FeatureHighlight: React.FC<{ icon: string, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-quility-light-green rounded-lg flex items-center justify-center">
            <Icon name={icon} size={24} className="text-quility-dark-green" />
        </div>
        <div>
            <h3 className="font-bold text-quility-dark-text">{title}</h3>
            <p className="text-sm text-quility-dark-grey">{children}</p>
        </div>
    </div>
);

const RecruitingUpsell: React.FC<RecruitingUpsellProps> = ({ onActivate }) => {
    return (
        <div className="flex items-center justify-center h-full p-4">
            <div className="max-w-2xl mx-auto text-center bg-white p-8 md:p-12 rounded-lg border border-quility-border shadow-lg">
                <Icon name="recruiting" size={48} className="mx-auto text-quility" />
                <h1 className="mt-4 text-3xl font-bold text-quility-dark-text">Unlock the Recruiting Power Pack</h1>
                <p className="mt-4 text-lg text-quility-dark-grey">
                    Supercharge your team building with a full suite of recruiting tools designed to help you find, manage, and onboard top talent.
                </p>

                <div className="mt-8 text-left space-y-6">
                    <FeatureHighlight icon="q-dataflow-1" title="Customizable Pipelines">
                        Visualize your entire recruiting funnel with drag-and-drop Kanban boards. Create multiple pipelines and customize stages to fit your process.
                    </FeatureHighlight>
                    <FeatureHighlight icon="briefcase" title="Job Post Management">
                        Create, manage, and reuse job post templates to ensure brand consistency and save time when posting to job boards.
                    </FeatureHighlight>
                    <FeatureHighlight icon="automation" title="Powerful Automations">
                        Set up triggers to automatically send emails, text messages, and resource packets when a recruit moves to a new stage in your pipeline.
                    </FeatureHighlight>
                </div>
                
                <div className="mt-10">
                     <p className="text-2xl font-bold text-quility-dark-text">$200.00 / month</p>
                    <p className="text-sm text-quility-dark-grey">per agent</p>
                    <button
                        onClick={onActivate}
                        className="mt-4 w-full sm:w-auto h-12 px-8 text-lg bg-quility-button text-quility-light-text font-bold rounded-md hover:bg-quility-button-hover transition-colors"
                    >
                        Activate Recruiting Module
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecruitingUpsell;

import React, { useState } from 'react';
import type { Lead, LeadLayoutBlockType, LeadLayoutType } from '../../../../types';
import Icon from '../../../common/Icon';
import CustomizeLayoutModal from '../CustomizeLayoutModal';

import LeadDetailsBlock from '../info-blocks/LeadDetailsBlock';
import TagsBlock from '../info-blocks/TagsBlock';
import NotesOverviewBlock from '../info-blocks/NotesOverviewBlock';
import FilesOverviewBlock from '../info-blocks/FilesOverviewBlock';
import ActivityLogBlock from '../info-blocks/ActivityLogBlock'; // Restored import

const blockComponents: { [key in LeadLayoutBlockType]: React.FC<{ lead: Lead; onUpdateLead: (updates: Partial<Lead>) => void }> } = {
    lead_details: LeadDetailsBlock,
    tags: TagsBlock,
    notes_overview: NotesOverviewBlock,
    files_overview: FilesOverviewBlock,
    activity_log: ActivityLogBlock, // Restored to map
};

// All available blocks for customization
export const ALL_LEAD_LAYOUT_BLOCKS: { id: LeadLayoutBlockType; label: string; icon: string; }[] = [
    { id: 'lead_details', label: 'Lead Details', icon: 'user-03' },
    { id: 'tags', label: 'Tags', icon: 'tag' },
    { id: 'activity_log', label: 'Activity Log', icon: 'activity-q' },
    { id: 'notes_overview', label: 'Recent Notes', icon: 'q-pencil' },
    { id: 'files_overview', label: 'Files & Documents', icon: 'attachment' },
];


const DEFAULT_LEAD_LAYOUTS: LeadLayoutType = {
    default: ['lead_details', 'tags', 'activity_log', 'notes_overview', 'files_overview'],
    'Final Expense': ['lead_details', 'notes_overview', 'activity_log', 'tags', 'files_overview'],
    'Mortgage Protection': ['tags', 'lead_details', 'files_overview', 'notes_overview', 'activity_log'],
};

const LAYOUT_STORAGE_KEY = 'funnel-lead-card-layouts';

interface OverviewTabProps {
    lead: Lead;
    onUpdateLead: (updates: Partial<Lead>) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ lead, onUpdateLead }) => {
    const [layouts, setLayouts] = useState<LeadLayoutType>(() => {
        try {
            const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
            return saved ? JSON.parse(saved) as LeadLayoutType : DEFAULT_LEAD_LAYOUTS;
        } catch {
            return DEFAULT_LEAD_LAYOUTS;
        }
    });

    const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

    const currentLayout = layouts[lead.lead_type] || layouts.default;

    const handleSaveLayout = (newLayout: LeadLayoutBlockType[]) => {
        const newLayouts = { ...layouts, [lead.lead_type]: newLayout };
        setLayouts(newLayouts);
        localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(newLayouts));
        setIsCustomizeModalOpen(false);
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setIsCustomizeModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white border border-quility-border text-quility-dark-text rounded-md hover:bg-quility-accent-bg"
                >
                    <Icon name="settings" size={14} />
                    Customize Layout
                </button>
            </div>
            <div className="space-y-6">
                {currentLayout.map((blockId) => {
                    const BlockComponent = blockComponents[blockId];
                    return BlockComponent ? <BlockComponent key={blockId} lead={lead} onUpdateLead={onUpdateLead} /> : null;
                })}
            </div>

            {isCustomizeModalOpen && (
                <CustomizeLayoutModal
                    leadType={lead.lead_type}
                    currentLayout={currentLayout}
                    allBlocks={ALL_LEAD_LAYOUT_BLOCKS}
                    onSave={handleSaveLayout}
                    onClose={() => setIsCustomizeModalOpen(false)}
                />
            )}
        </div>
    );
};

export default OverviewTab;

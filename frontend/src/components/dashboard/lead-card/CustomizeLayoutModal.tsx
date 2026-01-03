

import React, { useState } from 'react';
import Icon from '../../common/Icon';
import DraggableList from '../../common/DraggableList';
import { ALL_LEAD_LAYOUT_BLOCKS } from './tabs/OverviewTab';
import type { LeadLayoutBlockType } from '../../../types';
import PrimaryButton from '../../common/PrimaryButton';
import OutlineButton from '../../common/OutlineButton';

interface CustomizeLayoutModalProps {
    leadType: string;
    currentLayout: LeadLayoutBlockType[];
    allBlocks: { id: LeadLayoutBlockType; label: string; icon: string; }[];
    onSave: (newLayout: LeadLayoutBlockType[]) => void;
    onClose: () => void;
}

const CustomizeLayoutModal: React.FC<CustomizeLayoutModalProps> = ({ leadType, currentLayout, allBlocks, onSave, onClose }) => {
    const [activeBlocks, setActiveBlocks] = useState<LeadLayoutBlockType[]>(currentLayout);
    const [inactiveBlocks, setInactiveBlocks] = useState<LeadLayoutBlockType[]>(() =>
        allBlocks.filter(block => !currentLayout.includes(block.id)).map(block => block.id)
    );

    const handleAddBlock = (blockId: LeadLayoutBlockType) => {
        setInactiveBlocks(prev => prev.filter(id => id !== blockId));
        setActiveBlocks(prev => [...prev, blockId]);
    };

    const handleRemoveBlock = (blockId: LeadLayoutBlockType) => {
        setActiveBlocks(prev => prev.filter(id => id !== blockId));
        setInactiveBlocks(prev => [...prev, blockId]);
    };

    const getBlockDetails = (blockId: LeadLayoutBlockType) => {
        return ALL_LEAD_LAYOUT_BLOCKS.find(block => block.id === blockId) || { id: blockId, label: 'Unknown Block', icon: 'square-q' };
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl relative flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-quility-border flex-shrink-0">
                    <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-quility-destructive">
                        <Icon name="x-circle-q" size={28} />
                    </button>
                    <h2 className="text-xl font-bold text-quility-dark-text">Customize "{leadType}" Layout</h2>
                    <p className="text-sm text-quility-dark-grey mt-1">Drag and drop blocks to arrange your lead overview.</p>
                </div>
                <div className="flex-grow p-6 overflow-y-auto grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold text-quility-dark-text mb-3">Active Blocks (Drag to Reorder)</h3>
                        <div className="min-h-[150px] border-2 border-dashed border-quility-border rounded-lg p-2 bg-quility-accent-bg">
                            {activeBlocks.length === 0 && (
                                <p className="text-center text-quility-dark-grey text-sm py-4">Drag blocks here or click to add.</p>
                            )}
                            <DraggableList<LeadLayoutBlockType>
                                items={activeBlocks}
                                onReorder={setActiveBlocks}
                                renderItem={(blockId, index, isDragging) => {
                                    const block = getBlockDetails(blockId);
                                    return (
                                        <div className={`flex items-center gap-2 p-2 bg-white rounded-md border border-quility-border shadow-sm my-1 ${isDragging ? 'opacity-50' : ''}`}>
                                            <Icon name="grip-vertical" size={16} className="text-quility-dark-grey cursor-grab" />
                                            <Icon name={block.icon} size={18} className="text-quility-dark-green" />
                                            <span className="flex-grow text-sm font-medium text-quility-dark-text">{block.label}</span>
                                            <button onClick={() => handleRemoveBlock(blockId)} className="p-1.5 text-quility-destructive hover:text-red-700" title="Remove Block">
                                                <Icon name="math-minus-q" size={16} />
                                            </button>
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-quility-dark-text mb-3">Available Blocks</h3>
                        <div className="min-h-[150px] border-2 border-dashed border-quility-border rounded-lg p-2 bg-quility-accent-bg">
                            {inactiveBlocks.length === 0 && (
                                <p className="text-center text-quility-dark-grey text-sm py-4">All blocks are active!</p>
                            )}
                            {inactiveBlocks.map(blockId => {
                                const block = getBlockDetails(blockId);
                                return (
                                    <button
                                        key={blockId}
                                        onClick={() => handleAddBlock(blockId)}
                                        className="w-full text-left flex items-center gap-2 p-2 bg-white rounded-md border border-quility-border shadow-sm my-1 hover:bg-quility-light-hover"
                                    >
                                        <Icon name="plus" size={16} className="text-quility" />
                                        <Icon name={block.icon} size={18} className="text-quility-dark-green" />
                                        <span className="flex-grow text-sm font-medium text-quility-dark-text">{block.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-quility-accent-bg rounded-b-lg flex justify-end gap-3 mt-auto">
                    <OutlineButton label="Cancel" onClick={onClose} />
                    <PrimaryButton label="Save Layout" onClick={() => onSave(activeBlocks)} />
                </div>
            </div>
        </div>
    );
};

export default CustomizeLayoutModal;
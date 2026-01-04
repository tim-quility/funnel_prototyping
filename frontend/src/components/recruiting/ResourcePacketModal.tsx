import React, { useState } from 'react';
import Icon from '../common/Icon';
import type { RecruitingResource, ResourcePacket } from '../../types';

interface ResourcePacketModalProps {
    resources: RecruitingResource[];
    initialPacket?: ResourcePacket;
    onClose: () => void;
    onSave: (packetName: string, resourceIds: string[]) => void;
}

const ResourcePacketModal: React.FC<ResourcePacketModalProps> = ({ resources, initialPacket, onClose, onSave }) => {
    const [packetName, setPacketName] = useState(initialPacket?.name || '');
    const [selectedIds, setSelectedIds] = useState<string[]>(initialPacket?.resourceIds || []);
    const isEditing = !!initialPacket;

    const handleToggleResource = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(resId => resId !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        if (packetName.trim() && selectedIds.length > 0) {
            onSave(packetName, selectedIds);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-quility-border">
                    <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-quility-destructive">
                        <Icon name="x-circle-q" size={28} />
                    </button>
                    <h2 className="text-xl font-bold text-quility-dark-text">{isEditing ? 'Edit Resource Packet' : 'Create Resource Packet'}</h2>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                     <div>
                        <label className="block text-sm font-medium text-quility-dark-text mb-1">Packet Name</label>
                        <input
                            type="text"
                            value={packetName}
                            onChange={e => setPacketName(e.target.value)}
                            placeholder="e.g., Onboarding Documents"
                            className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-grey"
                            required
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-quility-dark-text mb-2">Select Resources to Include</h3>
                        <div className="space-y-2 border border-quility-border rounded-md p-3 max-h-60 overflow-y-auto">
                            {resources.map(resource => (
                                <label key={resource.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-quility-light-hover">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(resource.id)}
                                        onChange={() => handleToggleResource(resource.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-quility focus:ring-quility"
                                    />
                                    <span className="text-sm font-medium text-quility-dark-text">{resource.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-quility-accent-bg rounded-b-lg flex justify-end gap-3 mt-auto">
                    <button type="button" onClick={onClose} className="h-10 px-6 text-base font-bold bg-white border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-hover-grey">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!packetName.trim() || selectedIds.length === 0}
                        className="h-10 px-6 text-base font-bold rounded-md bg-quility-button text-quility-light-text hover:bg-quility-button-hover disabled:opacity-50"
                    >
                        {isEditing ? 'Save Changes' : 'Save Packet'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResourcePacketModal;
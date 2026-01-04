import React, { useState, useMemo } from 'react';
import VideoPlayerModal from '../common/VideoPlayerModal';
import ResourcePacketModal from './ResourcePacketModal';
import Icon from '../common/Icon';
import ConfirmationModal from '../common/ConfirmationModal';
import RecruitingResourceCard from './RecruitingResourceCard';
import EditRecruitingResourceModal from './EditRecruitingResourceModal';
import type { RecruitingResource, ResourcePacket } from '../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createResourcePacket, updateResourcePacket, deleteResourcePacket, createRecruitingResource, updateRecruitingResource, deleteRecruitingResource } from '../../utils/recruiting-api';

interface RecruitingResourcesProps {
    initialResources: RecruitingResource[];
    initialPackets: ResourcePacket[];
}

const RecruitingResources: React.FC<RecruitingResourcesProps> = ({ initialResources, initialPackets }) => {
    const queryClient = useQueryClient();
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
    
    // Modal states
    const [editingResource, setEditingResource] = useState<RecruitingResource | null>(null);
    const [isCreatingResource, setIsCreatingResource] = useState(false);
    const [editingPacket, setEditingPacket] = useState<ResourcePacket | null>(null);
    const [isCreatingPacket, setIsCreatingPacket] = useState(false);
    
    // Confirmation modal states
    const [deletingResource, setDeletingResource] = useState<RecruitingResource | null>(null);
    const [deletingPacket, setDeletingPacket] = useState<ResourcePacket | null>(null);

    // --- Mutations ---
    const resourceMutation = useMutation({
        mutationFn: (resource: RecruitingResource) => isCreatingResource ? createRecruitingResource(resource) : updateRecruitingResource(resource),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruitingData'] });
            setEditingResource(null);
            setIsCreatingResource(false);
        }
    });

    const deleteResourceMutation = useMutation({
        mutationFn: deleteRecruitingResource,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruitingData'] });
            setDeletingResource(null);
        }
    });

    const packetMutation = useMutation({
        mutationFn: (packet: ResourcePacket) => isCreatingPacket ? createResourcePacket(packet) : updateResourcePacket(packet),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruitingData'] });
            setEditingPacket(null);
            setIsCreatingPacket(false);
        }
    });

    const deletePacketMutation = useMutation({
        mutationFn: deleteResourcePacket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruitingData'] });
            setDeletingPacket(null);
        }
    });
    
    // --- Derived Data ---
    const categories = useMemo(() => {
        const allCats = new Set(initialResources.map(r => r.category));
        return ['All', ...Array.from(allCats)];
    }, [initialResources]);

    const filteredResources = useMemo(() => {
        if (categoryFilter === 'All') return initialResources;
        return initialResources.filter(r => r.category === categoryFilter);
    }, [initialResources, categoryFilter]);
    
    // --- Handlers ---
    const handleCardClick = (resourceUrl: string, type: 'video' | 'document' | 'script') => {
        if (type === 'video') setPlayingVideoUrl(resourceUrl);
        else alert(`Opening resource: ${resourceUrl}`);
    };

    const handleSaveResource = (resource: RecruitingResource) => {
        resourceMutation.mutate(resource);
    };

    const handleSavePacket = (packetName: string, resourceIds: string[]) => {
        const packetData = { id: editingPacket?.id || '', name: packetName, resourceIds };
        packetMutation.mutate(packetData);
    };
    
    const openCreateResourceModal = () => {
        setIsCreatingResource(true);
        setEditingResource({ id: '', type: 'video', title: '', description: '', category: '', contentUrl: '', thumbnailUrl: '' });
    };
    
    const openCreatePacketModal = () => {
        setIsCreatingPacket(true);
        setEditingPacket(null); // No initial packet when creating
    };

    return (
        <>
            <div className="space-y-8">
                {/* Resource Packets Section */}
                <div className="bg-white p-6 rounded-lg border border-quility-border">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-quility-dark-text">Resource Packets</h2>
                        <button
                            onClick={openCreatePacketModal}
                            className="px-3 py-1.5 text-sm font-bold bg-quility-button text-quility-light-text rounded-md hover:bg-quility-button-hover flex items-center gap-2"
                        >
                            <Icon name="plus" size={16} />
                            Create Packet
                        </button>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {initialPackets.map(packet => (
                            <div key={packet.id} className="p-4 bg-quility-accent-bg rounded-lg border border-quility-border group relative">
                                <Icon name="package" size={24} className="text-quility" />
                                <h3 className="font-bold text-quility-dark-text mt-2">{packet.name}</h3>
                                <p className="text-xs text-quility-dark-grey">{packet.resourceIds.length} item(s)</p>
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setIsCreatingPacket(false); setEditingPacket(packet); }} className="p-1.5 text-quility-dark-grey hover:text-quility rounded-full hover:bg-white/50"><Icon name="q-pencil" size={16} /></button>
                                    <button onClick={() => setDeletingPacket(packet)} className="p-1.5 text-quility-dark-grey hover:text-quility-destructive rounded-full hover:bg-white/50"><Icon name="trash-q" size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Individual Resources Section */}
                <div className="bg-white p-6 rounded-lg border border-quility-border">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-quility-dark-text">Individual Resources</h2>
                            <p className="text-quility-dark-grey mt-1">Materials to help you build your team.</p>
                        </div>
                         <div className="flex items-center gap-4">
                             <div className="flex items-center text-sm border-2 border-quility-border rounded-lg p-0.5">
                                {categories.map(cat => (
                                     <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1 rounded-md font-semibold transition-colors ${categoryFilter === cat ? 'bg-quility text-white shadow-inner' : 'text-quility-dark-grey hover:bg-quility-accent-bg'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                             <button onClick={openCreateResourceModal} className="px-3 py-2 text-sm font-bold bg-quility-button text-quility-light-text rounded-md hover:bg-quility-button-hover flex items-center gap-2">
                                <Icon name="plus" size={16} />
                                Add Resource
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResources.map(resource => (
                            <RecruitingResourceCard 
                                key={resource.id} 
                                resource={resource} 
                                onPlay={() => handleCardClick(resource.contentUrl, resource.type)}
                                onEdit={() => { setIsCreatingResource(false); setEditingResource(resource); }}
                                onDelete={() => setDeletingResource(resource)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {playingVideoUrl && <VideoPlayerModal videoUrl={playingVideoUrl} onClose={() => setPlayingVideoUrl(null)} />}
            
            {(isCreatingPacket || editingPacket) && 
                <ResourcePacketModal 
                    resources={initialResources} 
                    initialPacket={editingPacket || undefined}
                    onClose={() => { setEditingPacket(null); setIsCreatingPacket(false); }} 
                    onSave={handleSavePacket} 
                />
            }

            {(isCreatingResource || editingResource) &&
                <EditRecruitingResourceModal
                    resource={editingResource}
                    isCreating={isCreatingResource}
                    onClose={() => { setEditingResource(null); setIsCreatingResource(false); }}
                    onSave={handleSaveResource}
                />
            }

            {deletingResource && (
                <ConfirmationModal 
                    title="Delete Resource"
                    message={`Are you sure you want to delete "${deletingResource.title}"?`}
                    onConfirm={() => deleteResourceMutation.mutate(deletingResource.id)}
                    onClose={() => setDeletingResource(null)}
                />
            )}

            {deletingPacket && (
                 <ConfirmationModal 
                    title="Delete Packet"
                    message={`Are you sure you want to delete the packet "${deletingPacket.name}"?`}
                    onConfirm={() => deletePacketMutation.mutate(deletingPacket.id)}
                    onClose={() => setDeletingPacket(null)}
                />
            )}
        </>
    );
};

export default RecruitingResources;
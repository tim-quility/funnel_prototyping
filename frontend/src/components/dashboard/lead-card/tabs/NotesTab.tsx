
import React, { useState, useMemo } from 'react';
import type { Lead, LeadNote } from '../../../../types';
import Icon from '../../../common/Icon';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLeadNotes, createLeadNote, updateLeadNote, deleteLeadNote } from '../../../../utils/lead-api';
import ConfirmationModal from '../../../common/ConfirmationModal';
import Spinner from '../../../common/Spinner';

interface NotesTabProps {
    lead: Lead;
}

const NotesTab: React.FC<NotesTabProps> = ({ lead }) => {
    const queryClient = useQueryClient();
    const [newNoteContent, setNewNoteContent] = useState('');
    const [editingNote, setEditingNote] = useState<LeadNote | null>(null);
    const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

    const { data: notes, isLoading, isError, error } = useQuery<LeadNote[], Error>({
        queryKey: ['leadNotes', lead.id],
        queryFn: () => fetchLeadNotes(lead.id),
    });

    const createNoteMutation = useMutation<LeadNote, Error, Omit<LeadNote, 'id' | 'created_at' | 'agent_name'>>({
        mutationFn: (newNote) => createLeadNote(newNote, lead.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leadNotes', lead.id] });
            queryClient.invalidateQueries({ queryKey: ['lead', lead.id] }); // Invalidate lead to update notes overview
            setNewNoteContent('');
        },
        onError: (err) => alert(`Failed to add note: ${err.message}`),
    });

    const updateNoteMutation = useMutation<LeadNote, Error, { id: string; content: string }>({
        mutationFn: ({ id, content }) => updateLeadNote(id, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leadNotes', lead.id] });
            queryClient.invalidateQueries({ queryKey: ['lead', lead.id] });
            setEditingNote(null);
        },
        onError: (err) => alert(`Failed to update note: ${err.message}`),
    });

    const deleteNoteMutation = useMutation<string, Error, string>({
        mutationFn: deleteLeadNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leadNotes', lead.id] });
            queryClient.invalidateQueries({ queryKey: ['lead', lead.id] });
            setDeletingNoteId(null);
        },
        onError: (err) => alert(`Failed to delete note: ${err.message}`),
    });

    const handleAddNote = () => {
        if (newNoteContent.trim()) {
            createNoteMutation.mutate({ content: newNoteContent.trim(), lead_id: lead.id });
        }
    };

    const handleSaveEdit = () => {
        if (editingNote && editingNote.content.trim()) {
            updateNoteMutation.mutate({ id: editingNote.id, content: editingNote.content.trim() });
        }
    };

    const handleCancelEdit = () => {
        setEditingNote(null);
    };

    const handleDelete = (id: string) => {
        setDeletingNoteId(id);
    };

    const confirmDelete = () => {
        if (deletingNoteId) {
            deleteNoteMutation.mutate(deletingNoteId);
        }
    };

    const sortedNotes = useMemo(() => {
        return notes?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];
    }, [notes]);

    return (
        <div className="p-4 space-y-4 flex flex-col h-full">
            {/* Add New Note */}
            <div className="border border-quility-border rounded-lg p-3 bg-quility-accent-bg flex-shrink-0">
                <textarea
                    value={newNoteContent}
                    onChange={e => setNewNoteContent(e.target.value)}
                    placeholder={`Add a note for ${lead.name}...`}
                    rows={3}
                    className="w-full p-2 text-sm border rounded-md bg-white border-quility-border text-quility-dark-grey resize-y"
                    disabled={createNoteMutation.isPending}
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleAddNote}
                        disabled={!newNoteContent.trim() || createNoteMutation.isPending}
                        className="px-3 py-1.5 text-xs font-bold bg-quility-button text-quility-light-text rounded-md hover:bg-quility-button-hover disabled:opacity-50 flex items-center gap-2"
                    >
                        {createNoteMutation.isPending ? 'Adding...' : 'Add Note'}
                    </button>
                </div>
            </div>

            {/* Existing Notes */}
            <div className="space-y-3 flex-grow overflow-y-auto">
                {isLoading ? (
                    <div className="text-center py-10"><Spinner /></div>
                ) : isError ? (
                    <div className="text-center py-10 text-red-500">Error loading notes: {error?.message}</div>
                ) : sortedNotes.length > 0 ? (
                    sortedNotes.map(note => (
                        <div key={note.id} className="p-3 bg-white rounded-md border border-quility-border group relative">
                            {editingNote?.id === note.id ? (
                                <>
                                    <textarea
                                        value={editingNote.content}
                                        onChange={e => setEditingNote(prev => prev ? { ...prev, content: e.target.value } : null)}
                                        rows={3}
                                        className="w-full p-2 text-sm border rounded-md bg-white border-quility-border text-quility-dark-grey resize-y"
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={handleCancelEdit} className="px-3 py-1.5 text-xs font-semibold bg-white border border-quility-border text-quility-dark-text rounded-md hover:bg-quility-hover-grey">Cancel</button>
                                        <button onClick={handleSaveEdit} className="px-3 py-1.5 text-xs font-bold bg-quility-button text-quility-light-text rounded-md hover:bg-quility-button-hover">Save</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-quility-dark-text whitespace-pre-wrap">{note.content}</p>
                                    <p className="text-xs text-quility-dark-grey mt-2">
                                        Added by {note.agent_name} on {new Date(note.created_at).toLocaleString()}
                                    </p>
                                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingNote(note)} className="p-1.5 text-quility-dark-grey hover:text-quility rounded-full hover:bg-quility-accent-bg" title="Edit Note">
                                            <Icon name="q-pencil" size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(note.id)} className="p-1.5 text-quility-destructive hover:text-red-700 rounded-full hover:bg-quility-accent-bg" title="Delete Note">
                                            <Icon name="trash-q" size={16} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 text-quility-dark-grey">
                        <p>No notes found for this lead.</p>
                    </div>
                )}
            </div>
            {deletingNoteId && (
                <ConfirmationModal
                    title="Delete Note"
                    message="Are you sure you want to delete this note? This action cannot be undone."
                    confirmText="Delete"
                    onConfirm={confirmDelete}
                    onClose={() => setDeletingNoteId(null)}
                />
            )}
        </div>
    );
};

export default NotesTab;

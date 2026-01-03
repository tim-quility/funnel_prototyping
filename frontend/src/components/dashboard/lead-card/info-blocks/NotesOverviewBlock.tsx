
import React from 'react';
import type { Lead } from '../../../../types';
import Icon from '../../../common/Icon';
import { formatDistanceToNow } from '../../../../utils/formatters';

interface NotesOverviewBlockProps {
    lead: Lead;
}

const NotesOverviewBlock: React.FC<NotesOverviewBlockProps> = ({ lead }) => {
    const recentNotes = lead.notes?.slice(0, 2) || []; // Show up to 2 most recent notes

    return (
        <div className="bg-white p-4 rounded-lg border border-quility-border shadow-sm">
            <h3 className="font-bold text-quility-dark-text mb-3">Recent Notes</h3>
            <div className="space-y-3">
                {recentNotes.length > 0 ? (
                    recentNotes.map(note => (
                        <div key={note.id} className="text-sm text-quility-dark-text">
                            <p className="line-clamp-2">{note.content}</p>
                            <p className="text-xs text-quility-dark-grey mt-1">
                                {formatDistanceToNow(new Date(note.created_at))} by {note.agent_name}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-quility-dark-grey">No notes for this lead.</p>
                )}
            </div>
            {/* In a real app, this would likely switch to the 'Notes' tab */}
            {lead.notes && lead.notes.length > 2 && (
                <button className="mt-3 text-sm font-semibold text-quility hover:underline">
                    View All Notes ({lead.notes.length})
                </button>
            )}
        </div>
    );
};

export default NotesOverviewBlock;

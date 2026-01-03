

import React from 'react';
import type { Lead } from '../../../../types';
import Icon from '../../../common/Icon';
import { formatDistanceToNow } from '../../../../utils/formatters';

interface FilesOverviewBlockProps {
    lead: Lead;
}

const FilesOverviewBlock: React.FC<FilesOverviewBlockProps> = ({ lead }) => {
    const recentFiles = lead.files?.slice(0, 2) || []; // Show up to 2 most recent files

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) return 'image';
        if (fileType.includes('pdf')) return 'file-text';
        if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'q-list';
        return 'attachment';
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-quility-border shadow-sm">
            <h3 className="font-bold text-quility-dark-text mb-3">Recent Files</h3>
            <div className="space-y-3">
                {recentFiles.length > 0 ? (
                    recentFiles.map(file => (
                        <div key={file.id} className="flex items-center gap-2 text-sm text-quility-dark-text">
                            <Icon name={getFileIcon(file.file_type)} size={16} className="text-quility-dark-green flex-shrink-0" />
                            <div>
                                <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">{file.file_name}</a>
                                <p className="text-xs text-quility-dark-grey">
                                    {formatDistanceToNow(new Date(file.uploaded_at))} by {file.agent_name}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-quility-dark-grey">No files attached to this lead.</p>
                )}
            </div>
             {/* In a real app, this would likely switch to the 'Files' tab */}
            {lead.files && lead.files.length > 2 && (
                <button className="mt-3 text-sm font-semibold text-quility hover:underline">
                    View All Files ({lead.files.length})
                </button>
            )}
        </div>
    );
};

export default FilesOverviewBlock;

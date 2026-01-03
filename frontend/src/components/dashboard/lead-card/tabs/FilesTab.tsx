import React, { useState, useMemo, useRef } from 'react';
import type { Lead, LeadFile } from '../../../../types';
import Icon from '../../../common/Icon';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLeadFiles, uploadLeadFile, deleteLeadFile } from '../../../../utils/lead-api'; // Assuming these API functions exist
import ConfirmationModal from '../../../common/ConfirmationModal';
import Spinner from '../../../common/Spinner';
import PrimaryButton from '../../../common/PrimaryButton';

interface FilesTabProps {
    lead: Lead;
}

const FilesTab: React.FC<FilesTabProps> = ({ lead }) => {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

    const { data: files, isLoading, isError, error } = useQuery<LeadFile[], Error>({
        queryKey: ['leadFiles', lead.lead_id],
        queryFn: () => fetchLeadFiles(lead.lead_id),
    });

    const uploadFileMutation = useMutation<LeadFile, Error, { leadId: string; file: File }>({
        mutationFn: ({ leadId, file }) => uploadLeadFile(leadId, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leadFiles', lead.lead_id] });
        },
        onError: (err) => alert(`Failed to upload file: ${err.message}`),
    });

    const deleteFileMutation = useMutation<string, Error, string>({
        mutationFn: deleteLeadFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leadFiles', lead.lead_id] });
            setDeletingFileId(null);
        },
        onError: (err) => alert(`Failed to delete file: ${err.message}`),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            uploadFileMutation.mutate({ leadId: lead.lead_id, file });
            e.target.value = ''; // Clear input
        }
    };

    const handleDelete = (id: string) => {
        setDeletingFileId(id);
    };

    const confirmDelete = () => {
        if (deletingFileId) {
            deleteFileMutation.mutate(deletingFileId);
        }
    };

    const sortedFiles = useMemo(() => {
        return files?.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()) || [];
    }, [files]);

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) return 'image';
        if (fileType.includes('pdf')) return 'file-text';
        if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'q-list'; // Generic list icon for spreadsheets
        return 'attachment';
    };

    return (
        <div className="p-4 md:p-6">
            <div className="bg-white p-6 rounded-lg border border-quility-border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-quility-dark-text">Files for {lead.name}</h2>
                    <PrimaryButton
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadFileMutation.isPending}
                        label={uploadFileMutation.isPending ? (<Spinner />) : 'Upload File'}
                        leftIcon={uploadFileMutation.isPending ? undefined : 'upload-cloud'}
                    />
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        <div className="text-center py-10"><Spinner /> Loading files...</div>
                    ) : isError ? (
                        <div className="text-center py-10 text-red-500">Error loading files: {error?.message}</div>
                    ) : sortedFiles.length > 0 ? (
                        sortedFiles.map(file => (
                            <div key={file.id} className="p-3 bg-quility-accent-bg rounded-md border border-quility-border flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <Icon name={getFileIcon(file.file_type)} size={20} className="text-quility-dark-green" />
                                    <div>
                                        <p className="font-semibold text-quility-dark-text">{file.file_name}</p>
                                        <p className="text-xs text-quility-dark-grey">
                                            Uploaded by {file.agent_name} on {new Date(file.uploaded_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-quility-button hover:text-quility-dark-green rounded-full hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" title="Download File">
                                        <Icon name="file-down-q" size={16} />
                                    </a>
                                    <button onClick={() => handleDelete(file.id)} className="p-1.5 text-quility-destructive hover:text-red-700 rounded-full hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete File">
                                        <Icon name="trash-q" size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-quility-dark-grey">
                            <p>No files attached to this lead.</p>
                        </div>
                    )}
                </div>
            </div>
            {deletingFileId && (
                <ConfirmationModal
                    title="Delete File"
                    message="Are you sure you want to delete this file? This action cannot be undone."
                    confirmText="Delete"
                    onConfirm={confirmDelete}
                    onClose={() => setDeletingFileId(null)}
                />
            )}
        </div>
    );
};

export default FilesTab;
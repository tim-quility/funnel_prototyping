import React from 'react';
import Icon from '../common/Icon';
import type { PaginationMeta } from '../../types';

interface PaginationControlsProps {
    meta: PaginationMeta;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ meta, page, pageSize, onPageChange, onPageSizeChange }) => {
    const canGoBack = page > 1;
    const canGoForward = page < meta.lastPage;

    return (
        <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
                <span className="text-quility-dark-grey">Rows per page:</span>
                <select
                    value={pageSize}
                    onChange={e => onPageSizeChange(Number(e.target.value))}
                    className="h-8 px-2 border rounded-md bg-white border-quility-border text-quility-dark-text focus:outline-none focus:ring-1 focus:ring-quility/50"
                >
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                </select>
            </div>
            <span className="font-semibold text-quility-dark-text">
                {meta.from}-{meta.to} of {meta.total}
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={!canGoBack}
                    className="p-2 disabled:opacity-50"
                >
                    <Icon name="q-chevron-left" size={20} />
                </button>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={!canGoForward}
                    className="p-2 disabled:opacity-50"
                >
                    <Icon name="q-chevron-right" size={20} />
                </button>
            </div>
        </div>
    );
};

export default PaginationControls;

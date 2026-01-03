import React from 'react';
import OutlineButton from './OutlineButton';
import Icon from './Icon';

interface PaginationControlsProps {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    isLoading?: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, lastPage, total, perPage, onPageChange, onPerPageChange, isLoading }) => {
    const startItem = (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, total);

    const perPageOptions = [10, 25, 50];

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-quility-dark-grey">
                Showing {total > 0 ? `${startItem} to ${endItem}` : '0'} of {total} results.
            </div>
            <div className="flex items-center gap-2">
                <select
                    value={perPage}
                    onChange={e => onPerPageChange(parseInt(e.target.value, 10))}
                    disabled={isLoading}
                    className="h-9 px-3 text-sm border rounded-md bg-white border-quility-border text-quility-dark-text focus:outline-none focus:ring-1 focus:ring-quility/50"
                >
                    {perPageOptions.map(option => <option key={option} value={option}>{option} / page</option>)}
                </select>
                <OutlineButton
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    leftIcon="q-chevron-left"
                    label=""
                    className="p-2 h-9 w-9 flex items-center justify-center"
                />
                <span className="text-sm font-semibold text-quility-dark-text">Page {currentPage} of {lastPage}</span>
                <OutlineButton
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= lastPage || isLoading}
                    leftIcon="q-chevron-right"
                    label=""
                    className="p-2 h-9 w-9 flex items-center justify-center"
                />
            </div>
        </div>
    );
};

export default PaginationControls;
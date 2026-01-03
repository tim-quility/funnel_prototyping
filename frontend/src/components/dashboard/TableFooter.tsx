import React from 'react';
//import BulkActionFooter from './BulkActionFooter';
import PaginationControls from './PaginationControls';
import type { PaginationMeta } from '../../types';

interface TableFooterProps {
    selectedCount: number;
    onClearSelection: () => void;
    paginationMeta?: PaginationMeta;
    paginationState: { page: number; pageSize: number; };
    onPaginationChange: (newState: { page: number; pageSize: number; }) => void;
}

const TableFooter: React.FC<TableFooterProps> = ({ selectedCount, onClearSelection, paginationMeta, paginationState, onPaginationChange }) => {
    return (
        <footer className="fixed bottom-0 inset-x-0 z-10 mx-auto max-w-4xl bg-white border-t border-quility-border p-3 flex items-center justify-between">
            {selectedCount > 0 ? (
                null
            ) : (
                <div />
            )}

            {paginationMeta && paginationMeta.total > 0 && (
                <PaginationControls
                    meta={paginationMeta}
                    page={paginationState.page}
                    pageSize={paginationState.pageSize}
                    onPageChange={(newPage) => onPaginationChange({ ...paginationState, page: newPage })}
                    onPageSizeChange={(newPageSize) => onPaginationChange({ page: 1, pageSize: newPageSize })}
                />
            )}
        </footer>
    );
};

export default TableFooter;
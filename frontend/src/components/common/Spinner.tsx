import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-quility"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
